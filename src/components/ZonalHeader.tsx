import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";

const ZonalHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Zomato Drive</h1>
              <p className="text-sm text-muted-foreground hidden md:block">
                Zonal Performance Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-foreground">Zonal Head</p>
              <p className="text-xs text-muted-foreground">North Region</p>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ZonalHeader;
