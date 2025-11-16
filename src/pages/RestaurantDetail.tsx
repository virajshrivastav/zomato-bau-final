import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDriveSheet } from "@/hooks/useDriveSheets";
import { RestaurantHeader } from "@/components/temp/restaurant/RestaurantHeader";
import { MetricsRow } from "@/components/temp/restaurant/MetricsRow";
import { NCNManagementCard } from "@/components/temp/restaurant/NCNManagementCard";
import { N2RManagementCard } from "@/components/temp/restaurant/N2RManagementCard";
import { ItemsManagementCard } from "@/components/temp/restaurant/ItemsManagementCard";
import { CommentsSection } from "@/components/temp/restaurant/CommentsSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  RestaurantTempData,
  RestaurantMetrics,
  NCNData,
  N2RData,
  ItemsData,
} from "@/types/restaurantTemp";
import { parseStepperCode } from "@/utils/parseStepperCode";
import { parseBaseCode } from "@/utils/parseBaseCode";

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: restaurant, isLoading, error } = useDriveSheet(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error
              ? "Error loading restaurant data"
              : "This restaurant doesn't exist or you don't have access"}
          </p>
          <Button onClick={() => navigate("/kam-hub")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to KAM Hub
          </Button>
        </div>
      </div>
    );
  }

  // Transform API data to match new UI component interfaces
  const restaurantData: RestaurantTempData = {
    id: restaurant.res_id,
    name: restaurant.res_name,
    location: restaurant.locality || "N/A",
    cuisine: restaurant.cuisine || "N/A",
    phone: undefined,
    email: restaurant.am_email,
    toingFlag: (restaurant.toing_flag as "Live" | "Not Live") || "Not Live",
  };

  const metricsData: RestaurantMetrics = {
    activeDrives: 3, // NCN, N2R, Items
    zvdPo: restaurant.sept_ov || "N/A",
    adsBudget: {
      total: 50000,
      utilized: 32000,
      percentage: 64,
    },
    adsAvgAchievement: restaurant.ads_avg_achievement || undefined,
    adsBRCM: restaurant.ads_br_cm || undefined,
    commission: restaurant.current_commission || undefined,
    lastChangeDate: restaurant.last_change_date || undefined,
    toingFlag: (restaurant.toing_flag as "Live" | "Not Live") || "Not Live",
  };

  // NCN Data - Use real data from drive_sheets_data
  // Helper to check if a code is selected
  const isCodeSelected = (codeId: string, segment: "la" | "mm" | "um") => {
    const selectedCodes = restaurant.ncn_selected_codes;
    if (!selectedCodes || typeof selectedCodes !== "object") return false;
    const segmentCodes = selectedCodes[segment];
    return Array.isArray(segmentCodes) && segmentCodes.includes(codeId);
  };

  const ncnData: NCNData = {
    priorities: [
      restaurant.ncn_p1,
      restaurant.ncn_p2,
      restaurant.ncn_p3,
      restaurant.ncn_p4,
      restaurant.ncn_p5,
      restaurant.ncn_p6,
    ].filter(Boolean) as string[], // Remove null values
    activePromosLink: `https://admin.zomans.com/epicentre/marketing-planner/outlet-details?resId=${restaurant.res_id}`,
    suggestedPromos: {
      bogo: {
        items: restaurant.ncn_locality_x_cuisine?.split(", ").slice(0, 3) || [],
      },
      flashSale: {
        items: restaurant.ncn_locality_x_cuisine?.split(", ").slice(3, 6) || [],
      },
      salt: {
        percentage: 15,
      },
    },
    stepperAndBaseCodes: {
      la: [
        (() => {
          const parsed = parseBaseCode(restaurant.ncn_la_base_code_suggested);
          console.log("🔍 LA Base Code - Raw:", restaurant.ncn_la_base_code_suggested);
          console.log("🔍 LA Base Code - Parsed:", parsed);
          return (
            parsed && {
              id: "la-base",
              percentage: parsed.percentage,
              maxAmount: parsed.maxAmount,
              status: "Picked" as const,
              selected: isCodeSelected("la-base", "la"),
            }
          );
        })(),
        (() => {
          const parsed = parseStepperCode(restaurant.ncn_la_step1);
          return (
            parsed && {
              id: "la-step1",
              flatOff: parsed.flatOff,
              mov: parsed.mov,
              status: "Picked" as const,
              selected: isCodeSelected("la-step1", "la"),
            }
          );
        })(),
        (() => {
          const parsed = parseStepperCode(restaurant.ncn_la_step2);
          return (
            parsed && {
              id: "la-step2",
              flatOff: parsed.flatOff,
              mov: parsed.mov,
              status: "Picked" as const,
              selected: isCodeSelected("la-step2", "la"),
            }
          );
        })(),
        (() => {
          const parsed = parseStepperCode(restaurant.ncn_la_step3);
          return (
            parsed && {
              id: "la-step3",
              flatOff: parsed.flatOff,
              mov: parsed.mov,
              status: "Picked" as const,
              selected: isCodeSelected("la-step3", "la"),
            }
          );
        })(),
      ].filter(Boolean),
      mm: [
        (() => {
          const parsed = parseBaseCode(restaurant.ncn_mm_base_code_suggested);
          console.log("🔍 MM Base Code - Raw:", restaurant.ncn_mm_base_code_suggested);
          console.log("🔍 MM Base Code - Parsed:", parsed);
          return (
            parsed && {
              id: "mm-base",
              percentage: parsed.percentage,
              maxAmount: parsed.maxAmount,
              status: "Picked" as const,
              selected: isCodeSelected("mm-base", "mm"),
            }
          );
        })(),
        (() => {
          const parsed = parseStepperCode(restaurant.ncn_mm_step1);
          return (
            parsed && {
              id: "mm-step1",
              flatOff: parsed.flatOff,
              mov: parsed.mov,
              status: "Picked" as const,
              selected: isCodeSelected("mm-step1", "mm"),
            }
          );
        })(),
        (() => {
          const parsed = parseStepperCode(restaurant.ncn_mm_step2);
          return (
            parsed && {
              id: "mm-step2",
              flatOff: parsed.flatOff,
              mov: parsed.mov,
              status: "Picked" as const,
              selected: isCodeSelected("mm-step2", "mm"),
            }
          );
        })(),
        (() => {
          const parsed = parseStepperCode(restaurant.ncn_mm_step3);
          return (
            parsed && {
              id: "mm-step3",
              flatOff: parsed.flatOff,
              mov: parsed.mov,
              status: "Picked" as const,
              selected: isCodeSelected("mm-step3", "mm"),
            }
          );
        })(),
      ].filter(Boolean),
      um: [
        (() => {
          const parsed = parseBaseCode(restaurant.ncn_um_base_code_suggested);
          console.log("🔍 UM Base Code - Raw:", restaurant.ncn_um_base_code_suggested);
          console.log("🔍 UM Base Code - Parsed:", parsed);
          return (
            parsed && {
              id: "um-base",
              percentage: parsed.percentage,
              maxAmount: parsed.maxAmount,
              status: "Picked" as const,
              selected: isCodeSelected("um-base", "um"),
            }
          );
        })(),
        (() => {
          const parsed = parseStepperCode(restaurant.ncn_um_step1);
          return (
            parsed && {
              id: "um-step1",
              flatOff: parsed.flatOff,
              mov: parsed.mov,
              status: "Picked" as const,
              selected: isCodeSelected("um-step1", "um"),
            }
          );
        })(),
        (() => {
          const parsed = parseStepperCode(restaurant.ncn_um_step2);
          return (
            parsed && {
              id: "um-step2",
              flatOff: parsed.flatOff,
              mov: parsed.mov,
              status: "Picked" as const,
              selected: isCodeSelected("um-step2", "um"),
            }
          );
        })(),
        (() => {
          const parsed = parseStepperCode(restaurant.ncn_um_step3);
          return (
            parsed && {
              id: "um-step3",
              flatOff: parsed.flatOff,
              mov: parsed.mov,
              status: "Picked" as const,
              selected: isCodeSelected("um-step3", "um"),
            }
          );
        })(),
      ].filter(Boolean),
    },
    // Use KAM action columns (new) if available, fallback to old columns
    approached:
      restaurant.ncn_approached_by_kam ||
      (restaurant.ncn_approached?.toLowerCase() === "yes" ? "yes" : "no"),
    converted:
      restaurant.ncn_converted_by_kam ||
      (restaurant.ncn_converted_stepper?.toLowerCase() === "yes" ? "yes" : "no"),
  };

  // N2R Data - Use real data from drive_sheets_data
  const n2rData: N2RData = {
    currentCodes: {
      la: {
        aov: parseInt(restaurant.n2r_la_current_aov || "0"),
        currentCode: restaurant.n2r_la_current_code || "N/A",
      },
      mm: {
        aov: parseInt(restaurant.n2r_mm_current_aov || "0"),
        currentCode: restaurant.n2r_mm_current_code || "N/A",
      },
      um: {
        aov: parseInt(restaurant.n2r_um_current_aov || "0"),
        currentCode: restaurant.n2r_um_current_code || "N/A",
      },
    },
    suggestedCodes: {
      la: {
        construct: restaurant.n2r_la_suggested_construct || "50% upto 100",
        mov: restaurant.n2r_la_suggested_mov ? `${restaurant.n2r_la_suggested_mov}rs` : "199rs",
      },
      mm: {
        construct: restaurant.n2r_mm_suggested_construct || "60% upto 120",
        mov: restaurant.n2r_mm_suggested_mov ? `${restaurant.n2r_mm_suggested_mov}rs` : "249rs",
      },
      um: {
        construct: restaurant.n2r_um_suggested_construct || "70% upto 150",
        mov: restaurant.n2r_um_suggested_mov ? `${restaurant.n2r_um_suggested_mov}rs` : "349rs",
      },
    },
    reqCoupons: {
      la: parseInt(restaurant.n2r_la_min_coupons || "0"),
      mm: parseInt(restaurant.n2r_mm_min_coupons || "0"),
      um: parseInt(restaurant.n2r_um_min_coupons || "0"),
    },
    // Use KAM action columns (new) if available, fallback to old columns
    approached:
      restaurant.n2r_approached_by_kam ||
      (restaurant.n2r_approached?.toLowerCase() === "yes" ? "yes" : "no"),
    converted: restaurant.n2r_converted_by_kam || "no",
  };

  // Items Data - Use real data from drive_sheets_data
  const dishSuggestions = [
    restaurant.items_dish_tag_1,
    restaurant.items_dish_tag_2,
    restaurant.items_dish_tag_3,
    restaurant.items_dish_tag_4,
    restaurant.items_dish_tag_5,
    restaurant.items_dish_tag_6,
    restaurant.items_dish_tag_7,
  ].filter(Boolean) as string[];

  const itemsData: ItemsData = {
    priority: restaurant.items_priority || "P0",
    posFlag: restaurant.items_pos_flag || "N/A",
    pg7to10: restaurant.items_pg_7_10_contribution || "0%",
    dishSuggestions: dishSuggestions,
    // Use KAM action columns (new) if available, fallback to old columns
    approached:
      restaurant.items_approached_by_kam ||
      (restaurant.items_approached?.toLowerCase() === "yes" ? "yes" : "no"),
    converted:
      restaurant.items_converted_by_kam ||
      (restaurant.items_converted?.toLowerCase() === "yes" ? "yes" : "no"),
    // Load items from database if available, otherwise use empty template
    // Map from database format (name) to UI format (value)
    itemsAdded: restaurant.items_added
      ? restaurant.items_added.map((item: any) => ({
          id: item.id,
          value: item.name, // Database uses 'name', UI uses 'value'
          price: item.price,
          checked: item.checked,
        }))
      : [
          { id: "1", value: "", price: "", checked: false },
          { id: "2", value: "", price: "", checked: false },
          { id: "3", value: "", price: "", checked: false },
          { id: "4", value: "", price: "", checked: false },
          { id: "5", value: "", price: "", checked: false },
        ],
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="pt-6">
          <RestaurantHeader restaurant={restaurantData} />
        </div>

        {/* Metrics Row */}
        <MetricsRow metrics={metricsData} />

        {/* Three-Column Layout - Drive Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <NCNManagementCard data={ncnData} resId={id || ""} />
          <N2RManagementCard data={n2rData} resId={id || ""} />
          <ItemsManagementCard data={itemsData} resId={id || ""} />
        </div>

        {/* Comments Section */}
        <CommentsSection resId={id || ""} />
      </div>
    </div>
  );
};

export default RestaurantDetail;
