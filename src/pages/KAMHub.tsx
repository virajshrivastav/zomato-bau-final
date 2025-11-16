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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                {getUserInitials(user?.email)}
              </div>
              <div>
                <p className="text-sm font-medium">{restaurants?.[0]?.kam_name || "KAM"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <SearchBar
              className="flex-1 max-w-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left Column - Restaurants */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Restaurants</h2>
                  <p className="text-base text-muted-foreground mt-2">
                    {filteredRestaurants.length} restaurant
                    {filteredRestaurants.length !== 1 ? "s" : ""} under management
                  </p>
                </div>
                <Badge variant="outline" className="gap-2 px-4 py-2 text-sm">
                  <Store className="h-4 w-4" />
                  {filteredRestaurants.length} Total
                </Badge>
              </div>
              <div className="space-y-4">
                {filteredRestaurants.length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground text-lg">
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
                        className="group p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => navigate(`/restaurant/${restaurant.res_id}`)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-lg font-semibold">{restaurant.res_name}</span>
                              <StatusPill status={status} />
                              {driveCount > 1 && (
                                <Badge variant="secondary" className="text-xs">
                                  {driveCount} drives
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              {restaurant.locality && (
                                <div className="flex items-center gap-1">
                                  <Store className="h-3.5 w-3.5" />
                                  <span>{restaurant.locality}</span>
                                </div>
                              )}
                              {restaurant.cuisine && (
                                <div className="flex items-center gap-1">
                                  <span>•</span>
                                  <span>{restaurant.cuisine}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{orderVolume}</span>
                                <span className="text-xs">Sept OV</span>
                              </div>
                              {adsBR && (
                                <div className="flex items-center gap-1">
                                  <span>•</span>
                                  <span className="font-medium text-green-600">{adsBR}</span>
                                  <span className="text-xs">ADS BR</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column - Performance Metrics Button */}
            <div className="lg:col-span-1">
              <Button
                onClick={() => navigate("/kam-analytics")}
                className="w-full h-auto p-6 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group sticky top-24"
                size="lg"
              >
                <div className="p-4 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1">Performance Metrics</h3>
                  <p className="text-sm opacity-90">View your analytics & rankings</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium opacity-90 group-hover:gap-3 transition-all">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KAMHub;
