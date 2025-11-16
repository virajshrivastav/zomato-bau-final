/**
 * Vercel Serverless Function: Test Google Sheets Sync Configuration
 * ==================================================================
 * Diagnostic endpoint to test Google Sheets API configuration
 * 
 * Endpoint: GET /api/test-sync
 */

import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

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
 * Main handler function
 */
export default async function handler(req, res) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
    checks: {},
  };

  // Check 1: Environment Variables
  diagnostics.checks.envVars = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_SHEET_ID: !!process.env.GOOGLE_SHEET_ID,
    VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  // Check 2: Google Credentials
  try {
    const credentials = getGoogleCredentials();
    diagnostics.checks.googleCredentials = {
      success: true,
      email: credentials.client_email,
      privateKeyLength: credentials.private_key?.length || 0,
      source: process.env.GOOGLE_PRIVATE_KEY ? "environment" : "file",
    };
  } catch (error) {
    diagnostics.checks.googleCredentials = {
      success: false,
      error: error.message,
    };
  }

  // Check 3: Google Sheets API Connection
  try {
    const credentials = getGoogleCredentials();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    
    const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ";
    
    // Try to read from the sheet
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    diagnostics.checks.googleSheetsAPI = {
      success: true,
      sheetTitle: response.data.properties?.title,
      sheetId: SHEET_ID,
    };
  } catch (error) {
    diagnostics.checks.googleSheetsAPI = {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  // Check 4: Supabase Connection
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to query the database
    const { data, error } = await supabase
      .from("drive_sheets_data")
      .select("res_id")
      .limit(1);

    if (error) throw error;

    diagnostics.checks.supabase = {
      success: true,
      url: supabaseUrl,
      canQuery: true,
    };
  } catch (error) {
    diagnostics.checks.supabase = {
      success: false,
      error: error.message,
    };
  }

  // Overall status
  const allChecks = Object.values(diagnostics.checks);
  const failedChecks = allChecks.filter(check => check.success === false);
  
  diagnostics.overall = {
    status: failedChecks.length === 0 ? "PASS" : "FAIL",
    totalChecks: allChecks.length,
    failedChecks: failedChecks.length,
  };

  return res.status(200).json(diagnostics);
}

