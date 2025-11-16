/**
 * Vercel Serverless Function: Google Sheets Sync
 * ===============================================
 * Syncs a single restaurant's KAM actions from Supabase to Google Sheets.
 *
 * Endpoint: POST /api/sync-sheets
 * Body: { resId: string, drive: "ncn" | "n2r" | "items" }
 */

import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

// Configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ";

const TAB_NAMES = {
  ncn: "NCN",
  n2r: "N2R",
  items: "Items >=159",
  comments: "Comments and Notes",
};

/**
 * Get Google credentials (from env vars or local file)
 */
function getGoogleCredentials() {
  // For Vercel deployment: use environment variables
  if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    return {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  // For local development: read from credentials file
  try {
    const credentialsPath = join(process.cwd(), "service-account-credentials.json");
    const credentials = JSON.parse(readFileSync(credentialsPath, "utf8"));
    return {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    };
  } catch (error) {
    throw new Error(
      "Google credentials not found. Set GOOGLE_PRIVATE_KEY and GOOGLE_SERVICE_ACCOUNT_EMAIL environment variables or provide service-account-credentials.json"
    );
  }
}

/**
 * Initialize Google Sheets client
 */
function getGoogleSheetsClient() {
  const credentials = getGoogleCredentials();

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * Initialize Supabase client
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials");
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Fetch restaurant data from Supabase
 */
async function fetchRestaurantData(supabase, resId) {
  const { data, error } = await supabase
    .from("drive_sheets_data")
    .select("*")
    .eq("res_id", resId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Find existing row or determine where to append new row
 */
async function findOrCreateRow(sheets, tabName, resId) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A:A`,
  });

  const values = response.data.values || [];

  // Skip title (row 1) and header (row 2)
  for (let i = 2; i < values.length; i++) {
    if (values[i][0] === String(resId)) {
      return i + 1; // Convert to 1-based row number
    }
  }

  // Not found, append at the end
  return values.length + 1;
}

/**
 * Helper function to convert code ID to human-readable format
 * @param {string} codeId - Code ID like "la-base", "mm-step1", etc.
 * @param {object} restaurantData - Restaurant data containing code values
 * @returns {string} Human-readable code format
 */
function formatCodeForSheets(codeId, restaurantData) {
  // Base codes: "la-base", "mm-base", "um-base"
  if (codeId.endsWith("-base")) {
    const segment = codeId.split("-")[0]; // "la", "mm", or "um"
    const baseCodeField = `ncn_${segment}_base_code_suggested`;
    const baseCode = restaurantData[baseCodeField];

    if (!baseCode) return codeId;

    // Parse format like "40 upto 80" to "40% upto 80rs"
    const match = baseCode.match(/(\d+)\s*%?\s*upto\s*(\d+)\s*rs?/i);
    if (match) {
      return `${match[1]}% upto ${match[2]}rs`;
    }
    return baseCode;
  }

  // Stepper codes: "la-step1", "mm-step2", etc.
  const stepMatch = codeId.match(/^(la|mm|um)-step(\d+)$/);
  if (stepMatch) {
    const segment = stepMatch[1];
    const stepNum = stepMatch[2];
    const stepField = `ncn_${segment}_step${stepNum}`;
    const stepCode = restaurantData[stepField];

    if (!stepCode) return codeId;

    // Parse format like "Flat 100 on 249" or "100 on 249"
    const match = stepCode.match(/(?:Flat\s+)?(\d+)\s+on\s+(\d+)/i);
    if (match) {
      return `Flat ${match[1]} on ${match[2]}`;
    }
    return stepCode;
  }

  return codeId;
}

/**
 * Sync NCN data to Google Sheets
 */
async function syncNCN(sheets, restaurantData) {
  const resId = restaurantData.res_id;
  const rowNum = await findOrCreateRow(sheets, TAB_NAMES.ncn, resId);

  // Extract NCN selected codes and convert to human-readable format
  const selectedCodes = restaurantData.ncn_selected_codes || {};

  const laCodes = Array.isArray(selectedCodes.la)
    ? selectedCodes.la.map(id => formatCodeForSheets(id, restaurantData)).join(", ")
    : "";
  const mmCodes = Array.isArray(selectedCodes.mm)
    ? selectedCodes.mm.map(id => formatCodeForSheets(id, restaurantData)).join(", ")
    : "";
  const umCodes = Array.isArray(selectedCodes.um)
    ? selectedCodes.um.map(id => formatCodeForSheets(id, restaurantData)).join(", ")
    : "";

  // Prepare row data (9 columns)
  const rowData = [
    String(resId),
    restaurantData.res_name || "",
    restaurantData.am_email || "",
    restaurantData.ncn_approached_by_kam || "",
    restaurantData.ncn_converted_by_kam || "",
    laCodes,
    mmCodes,
    umCodes,
    "", // Picked Status - TBD
  ];

  // Update the row
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB_NAMES.ncn}!A${rowNum}:I${rowNum}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [rowData],
    },
  });

  return { rowNum, tabName: TAB_NAMES.ncn };
}

/**
 * Sync N2R data to Google Sheets
 */
async function syncN2R(sheets, restaurantData) {
  const resId = restaurantData.res_id;
  const rowNum = await findOrCreateRow(sheets, TAB_NAMES.n2r, resId);

  // Prepare row data (5 columns)
  const rowData = [
    String(resId),
    restaurantData.res_name || "",
    restaurantData.am_email || "",
    restaurantData.n2r_approached_by_kam || "",
    restaurantData.n2r_converted_by_kam || "",
  ];

  // Update the row
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB_NAMES.n2r}!A${rowNum}:E${rowNum}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [rowData],
    },
  });

  return { rowNum, tabName: TAB_NAMES.n2r };
}

/**
 * Sync Items data to Google Sheets
 */
async function syncItems(sheets, restaurantData) {
  const resId = restaurantData.res_id;
  const rowNum = await findOrCreateRow(sheets, TAB_NAMES.items, resId);

  // Extract items added
  const itemsAdded = restaurantData.items_added || [];

  // Prepare row data (15 columns: basic + 5 items with prices)
  const rowData = [
    String(resId),
    restaurantData.res_name || "",
    restaurantData.am_email || "",
    restaurantData.items_approached_by_kam || "",
    restaurantData.items_converted_by_kam || "",
  ];

  // Add up to 5 items
  for (let i = 0; i < 5; i++) {
    if (i < itemsAdded.length && itemsAdded[i]?.checked) {
      rowData.push(itemsAdded[i].name || "");
      rowData.push(itemsAdded[i].price || "");
    } else {
      rowData.push("");
      rowData.push("");
    }
  }

  // Update the row
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB_NAMES.items}!A${rowNum}:O${rowNum}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [rowData],
    },
  });

  return { rowNum, tabName: TAB_NAMES.items };
}

/**
 * Sync Comments to Google Sheets
 */
async function syncComments(sheets, supabase, resId) {
  // Fetch restaurant data for basic info
  const restaurantData = await fetchRestaurantData(supabase, resId);

  // Fetch all comments for this restaurant
  const { data: comments, error } = await supabase
    .from("restaurant_comments")
    .select("*")
    .eq("res_id", resId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Combine all comments into a single string (most recent first)
  const combinedComments = comments
    .map((c) => `[${c.author_name || c.author_email}] ${c.comment_text}`)
    .join(" | ");

  const rowNum = await findOrCreateRow(sheets, TAB_NAMES.comments, resId);

  // Prepare row data (4 columns: Res ID, Res Name, KAM, Comments)
  const rowData = [
    String(resId),
    restaurantData.res_name || "",
    restaurantData.am_email || "",
    combinedComments || "",
  ];

  // Update the row
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB_NAMES.comments}!A${rowNum}:D${rowNum}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [rowData],
    },
  });

  return { rowNum, tabName: TAB_NAMES.comments };
}

/**
 * Main handler function
 */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { resId, drive } = req.body;

  // Validation
  if (!resId) {
    return res.status(400).json({ success: false, error: "Missing required field: resId" });
  }

  if (!drive || !["ncn", "n2r", "items", "comments"].includes(drive)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid drive type. Must be: ncn, n2r, items, or comments" });
  }

  try {
    console.log(`[Sync API] Starting sync for restaurant ${resId}, drive: ${drive}`);

    // Initialize clients
    let sheets, supabase;
    try {
      sheets = getGoogleSheetsClient();
      console.log("[Sync API] ✅ Google Sheets client initialized");
    } catch (error) {
      console.error("[Sync API] ❌ Failed to initialize Google Sheets client:", error.message);
      throw new Error(`Google Sheets initialization failed: ${error.message}`);
    }

    try {
      supabase = getSupabaseClient();
      console.log("[Sync API] ✅ Supabase client initialized");
    } catch (error) {
      console.error("[Sync API] ❌ Failed to initialize Supabase client:", error.message);
      throw new Error(`Supabase initialization failed: ${error.message}`);
    }

    // Sync based on drive type
    let result;
    if (drive === "comments") {
      // Comments sync doesn't need restaurant data validation
      console.log(`[Sync API] Syncing comments for ${resId}...`);
      result = await syncComments(sheets, supabase, resId);
    } else {
      // Fetch restaurant data for other drives
      console.log(`[Sync API] Fetching restaurant data for ${resId}...`);
      const restaurantData = await fetchRestaurantData(supabase, resId);

      if (!restaurantData) {
        console.error(`[Sync API] ❌ Restaurant ${resId} not found in database`);
        return res.status(404).json({ success: false, error: `Restaurant ${resId} not found` });
      }

      console.log(`[Sync API] ✅ Restaurant data fetched for ${resId}`);

      if (drive === "ncn") {
        console.log(`[Sync API] Syncing NCN data for ${resId}...`);
        result = await syncNCN(sheets, restaurantData);
      } else if (drive === "n2r") {
        console.log(`[Sync API] Syncing N2R data for ${resId}...`);
        result = await syncN2R(sheets, restaurantData);
      } else if (drive === "items") {
        console.log(`[Sync API] Syncing Items data for ${resId}...`);
        result = await syncItems(sheets, restaurantData);
      }
    }

    console.log(
      `[Sync API] ✅ Successfully synced restaurant ${resId} (${drive}) to ${result.tabName} row ${result.rowNum}`
    );

    return res.status(200).json({
      success: true,
      message: `Synced restaurant ${resId} (${drive}) to Google Sheets`,
      details: result,
    });
  } catch (error) {
    console.error("[Sync API] ❌ Sync error:", {
      message: error.message,
      stack: error.stack,
      resId,
      drive,
    });

    return res.status(500).json({
      success: false,
      error: error.message || "Unknown error occurred",
      errorType: error.constructor.name,
      resId,
      drive,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
