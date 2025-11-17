import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Mail, Share2 } from "lucide-react";
import { RestaurantTempData } from "@/types/restaurantTemp";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle } from "@/components/DarkModeToggle";

interface RestaurantHeaderProps {
  restaurant: RestaurantTempData;
}

export const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    if (restaurant.phone) {
      window.open(`https://wa.me/${restaurant.phone.replace(/\s/g, "")}`, "_blank");
    }
  };

  const handleMail = () => {
    if (restaurant.email) {
      window.location.href = `mailto:${restaurant.email}`;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Check out ${restaurant.name} - ${restaurant.location}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
        {/* Left Section - Restaurant Info */}
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted flex-shrink-0 mt-0.5 sm:mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="mb-2 sm:mb-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight break-words">
                {restaurant.name}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm">
              <span className="font-semibold text-foreground bg-muted px-3 py-1 rounded-md inline-block w-fit">
                {restaurant.id}
              </span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 font-medium w-fit"
              >
                {restaurant.cuisine}
              </Badge>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="text-muted-foreground font-medium break-words">
                {restaurant.location}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleWhatsApp}
            disabled={!restaurant.phone}
            className="hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-colors flex-1 sm:flex-initial"
          >
            <Phone className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMail}
            disabled={!restaurant.email}
            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors flex-1 sm:flex-initial"
          >
            <Mail className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Mail</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 transition-colors flex-1 sm:flex-initial"
          >
            <Share2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <DarkModeToggle />
        </div>
      </div>
    </div>
  );
};
