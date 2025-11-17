import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { StatusPill } from "@/components/StatusPill";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useDriveSheets } from "@/hooks/useDriveSheets";
import { ChevronRight, Store, ArrowLeft, Loader2, BarChart3 } from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";

// Helper function to determine status based on restaurant data
const getRestaurantStatus = (
  restaurant: any
): "best" | "good" | "poor" | "pending" | "approached" => {
  if (!restaurant.drive_data || restaurant.drive_data.length === 0) return "pending";

  const hasConverted = restaurant.drive_data.some((dd: any) => dd.converted_stepper);
  const hasApproached = restaurant.drive_data.some((dd: any) => dd.approached);

  if (hasConverted) return "best";
  if (hasApproached) return "approached";

  // Based on revenue (sept_ov)
  if (restaurant.sept_ov && restaurant.sept_ov > 60000) return "good";
  if (restaurant.sept_ov && restaurant.sept_ov > 40000) return "good";

  return "pending";
};

const KAMHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: restaurants, isLoading, error } = useDriveSheets();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter restaurants based on search
  const filteredRestaurants =
    restaurants?.filter(
      (restaurant) =>
        restaurant.res_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Get user initials
  const getUserInitials = (email: string | undefined) => {
    if (!email) return "KAM";
    const parts = email.split("@")[0].split(".");
    return parts
      .map((p) => p[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading restaurants</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-muted flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs sm:text-sm flex-shrink-0">
                {getUserInitials(user?.email)}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">
                  {restaurants?.[0]?.kam_name || "KAM"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <SearchBar
                className="flex-1 sm:max-w-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
            {/* Left Column - Restaurants */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words">
                    Restaurants
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                    {filteredRestaurants.length} restaurant
                    {filteredRestaurants.length !== 1 ? "s" : ""} under management
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm flex-shrink-0"
                >
                  <Store className="h-3 w-3 sm:h-4 sm:w-4" />
                  {filteredRestaurants.length} Total
                </Badge>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {filteredRestaurants.length === 0 ? (
                  <Card className="p-6 sm:p-8 md:p-12 text-center">
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                      {searchQuery ? "No restaurants match your search" : "No restaurants assigned"}
                    </p>
                  </Card>
                ) : (
                  filteredRestaurants.map((restaurant, index) => {
                    const status = getRestaurantStatus(restaurant);
                    const driveCount = restaurant.drive_data?.length || 0;
                    // sept_ov is order volume (number of orders), not rupees
                    const orderVolume = restaurant.sept_ov
                      ? parseFloat(restaurant.sept_ov).toFixed(0)
                      : "N/A";

                    // Format ADS BR (Booked Revenue)
                    const adsBR = restaurant.ads_br_cm
                      ? `₹${parseFloat(restaurant.ads_br_cm).toLocaleString("en-IN")}`
                      : null;

                    return (
                      <Card
                        key={restaurant.res_id}
                        className="group p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => navigate(`/restaurant/${restaurant.res_id}`)}
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                          <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                              <span className="text-sm sm:text-base md:text-lg font-semibold break-words">
                                {restaurant.res_name}
                              </span>
                              <StatusPill status={status} />
                              {driveCount > 1 && (
                                <Badge variant="secondary" className="text-xs flex-shrink-0">
                                  {driveCount} drives
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                              {restaurant.locality && (
                                <div className="flex items-center gap-1">
                                  <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                  <span className="break-words">{restaurant.locality}</span>
                                </div>
                              )}
                              {restaurant.cuisine && (
                                <div className="flex items-center gap-1">
                                  <span>•</span>
                                  <span className="break-words">{restaurant.cuisine}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className="font-medium">{orderVolume}</span>
                                <span className="text-xs">Sept OV</span>
                              </div>
                              {adsBR && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <span>•</span>
                                  <span className="font-medium text-green-600">{adsBR}</span>
                                  <span className="text-xs">ADS BR</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column - Performance Metrics Button */}
            <div className="lg:col-span-1">
              <div
                onClick={() => navigate("/kam-analytics")}
                className="w-full h-auto p-6 rounded-xl bg-gradient-to-br from-primary via-primary/95 to-primary/90 hover:from-primary/95 hover:via-primary/90 hover:to-primary/85 text-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group sticky top-20 sm:top-24 border border-white/10"
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* Icon */}
                  <div className="p-4 bg-white/15 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-inner">
                    <BarChart3 className="h-8 w-8" />
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-2 w-full">
                    <h3 className="text-xl font-bold leading-tight tracking-tight">
                      Performance Metrics
                    </h3>
                    <p className="text-sm opacity-95 leading-tight font-medium">
                      View your analytics & rankings
                    </p>
                  </div>

                  {/* View Details Link */}
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold opacity-95 group-hover:gap-3 transition-all mt-1">
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KAMHub;
