// TypeScript interfaces for temporary restaurant detail UI

export interface RestaurantTempData {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  phone?: string;
  email?: string;
  toingFlag: "Live" | "Not Live"; // TOING App status
}

export interface RestaurantMetrics {
  activeDrives: number;
  zvdPo: string;
  adsBudget: {
    total: number;
    utilized: number;
    percentage: number;
  };
  adsAvgAchievement?: string; // Average ADS Achievement % from database
  adsBRCM?: string; // ADS Booked Revenue Current Month
  commission?: string; // Current commission percentage
  lastChangeDate?: string; // Last commission change date
  toingFlag: "Live" | "Not Live"; // Replaces cuisine in metrics
}

// NCN - No Cooking November Interfaces
export interface PromoCode {
  id: string;
  // For flat discount codes (stepper codes)
  flatOff?: number; // Editable - Flat discount amount
  mov?: number; // Minimum Order Value - Editable
  // For percentage-based codes (base codes)
  percentage?: number; // Editable - Percentage discount
  maxAmount?: number; // Editable - Maximum discount amount (upto value)
  status: "Submitted" | "Picked" | "Pending";
  selected: boolean;
}

export interface NCNData {
  priorities: string[]; // 6 priority items
  activePromosLink: string; // Link to admin dashboard
  suggestedPromos: {
    bogo: {
      items: string[]; // List of BOGO items
    };
    flashSale: {
      items: string[]; // List of Flash Sale items
    };
    salt: {
      percentage: number; // Salt percentage
    };
  };
  stepperAndBaseCodes: {
    la: PromoCode[];
    mm: PromoCode[];
    um: PromoCode[];
  };
  approached: "yes" | "no" | null;
  converted: "yes" | "wip" | "no" | null;
}

// N2R - New To Restaurant Interfaces
export interface N2RSegmentData {
  aov: number; // Average Order Value
  currentCode: string; // Currently live code
}

export interface N2RSuggestedCode {
  construct: string; // e.g., "60% upto 120"
  mov: string; // e.g., "199rs"
}

export interface N2RData {
  currentCodes: {
    la: N2RSegmentData;
    mm: N2RSegmentData;
    um: N2RSegmentData;
  };
  suggestedCodes: {
    la: N2RSuggestedCode;
    mm: N2RSuggestedCode;
    um: N2RSuggestedCode;
  };
  reqCoupons: {
    la: number;
    mm: number;
    um: number;
  };
  approached: "yes" | "no" | null;
  converted: "yes" | "wip" | "no" | null;
}

// Items <= 159 Interfaces
export interface ItemAddedField {
  id: string;
  value: string; // Item name
  price: string; // Item price
  checked: boolean;
}

export interface ItemsData {
  priority: string; // e.g., "P0", "P1", "P2"
  posFlag: string; // e.g., "Pet Pooja", "DotPay"
  pg7to10: string; // e.g., "23%"
  dishSuggestions: string[]; // 6 dish names
  approached: "yes" | "no" | null;
  converted: "yes" | "wip" | "no" | null;
  itemsAdded: ItemAddedField[]; // Fill-in-the-blank fields
}

// Comments Interface
export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

// Main Restaurant Detail Data Interface
export interface RestaurantDetailTempData {
  restaurant: RestaurantTempData;
  metrics: RestaurantMetrics;
  ncn: NCNData;
  n2r: N2RData;
  items: ItemsData;
  comments: Comment[];
}
