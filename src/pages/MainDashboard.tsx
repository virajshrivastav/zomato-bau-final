import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/DashboardCard";
import { MetricItem } from "@/components/MetricItem";
import { StatusPill } from "@/components/StatusPill";
import { MapPin, Users, Clock, Zap, ArrowRight, LogOut, Store } from "lucide-react";
import { ZomatomLogo } from "@/components/ui/zomato-logo";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MainDashboard = () => {
  const navigate = useNavigate();
  const [showAllKAMs, setShowAllKAMs] = useState(false);

  const handleSignOut = () => {
    navigate("/");
  };

  // Complete KAM list with GM Coverage
  const allKAMs = [
    { email: "shirdi.narayan@zomato.com", name: "Shirdi Narayan", score: 78.2 },
    { email: "rinkel.shah@zomato.com", name: "Rinkel Shah", score: 64.6 },
    { email: "puneet.bablani@zomato.com", name: "Puneet Bablani", score: 49.8 },
    { email: "pandey.adarsh@zomato.com", name: "Pandey Adarsh", score: 47.2 },
    { email: "veda.bhatt@zomato.com", name: "Veda Bhatt", score: 47.2 },
    { email: "rakesh.hati@zomato.com", name: "Rakesh Hati", score: 42.8 },
    { email: "shefali.deshmukh@zomato.com", name: "Shefali Deshmukh", score: 39.3 },
    { email: "shounak.prabhukeluskar@zomato.com", name: "Shounak Prabhukeluskar", score: 39.3 },
    { email: "paridhi.shrivastava@zomato.com", name: "Paridhi Shrivastava", score: 39.2 },
    { email: "shrawani.wankhade@zomato.com", name: "Shrawani Wankhade", score: 38.7 },
    { email: "bhuwneshwari.dhouni@zomato.com", name: "Bhuwneshwari Dhouni", score: 38.5 },
    { email: "pranav.salvi@zomato.com", name: "Pranav Salvi", score: 38.2 },
    { email: "pacharne.hemraj@zomato.com", name: "Pacharne Hemraj", score: 36.9 },
    { email: "shiv.udasi@zomato.com", name: "Shiv Udasi", score: 36.6 },
    { email: "kunal.surulkar@zomato.com", name: "Kunal Surulkar", score: 36.5 },
    { email: "priya.joseph@zomato.com", name: "Priya Joseph", score: 35.6 },
    { email: "shriniwas.bewoor@zomato.com", name: "Shriniwas Bewoor", score: 34.6 },
    { email: "shiwani.jha@zomato.com", name: "Shiwani Jha", score: 33.3 },
    { email: "dimple.sadrani@zomato.com", name: "Dimple Sadrani", score: 33.3 },
    { email: "sanket.kadam@zomato.com", name: "Sanket Kadam", score: 32.7 },
    { email: "shakshy.meel@zomato.com", name: "Shakshy Meel", score: 32.6 },
    { email: "vaishnavi.wani@zomato.com", name: "Vaishnavi Wani", score: 31.1 },
    { email: "rohit.shelar@zomato.com", name: "Rohit Shelar", score: 30.5 },
    { email: "pranavi.parab@zomato.com", name: "Pranavi Parab", score: 30.2 },
    { email: "saksham.bassi@zomato.com", name: "Saksham Bassi", score: 29.5 },
    { email: "harshit.chhabra@zomato.com", name: "Harshit Chhabra", score: 29.1 },
    { email: "tanush.pasari@zomato.com", name: "Tanush Pasari", score: 29.0 },
    { email: "siddesh.jagtap@zomato.com", name: "Siddesh Jagtap", score: 27.3 },
    { email: "anudeep.pawar@zomato.com", name: "Anudeep Pawar", score: 24.6 },
    { email: "rashika.dokania@zomato.com", name: "Rashika Dokania", score: 23.7 },
    { email: "gupta.ansh@zomato.com", name: "Gupta Ansh", score: 22.1 },
    { email: "utkarsh.narnaware@zomato.com", name: "Utkarsh Narnaware", score: 22.0 },
    { email: "rakesh.chachada@zomato.com", name: "Rakesh Chachada", score: 21.8 },
    { email: "paliwal.grasim@zomato.com", name: "Paliwal Grasim", score: 21.5 },
    { email: "aditya.d@zomato.com", name: "Aditya D", score: 20.9 },
    { email: "uddesh.pillay@zomato.com", name: "Uddesh Pillay", score: 19.2 },
    { email: "rutuja.jangam@zomato.com", name: "Rutuja Jangam", score: 18.8 },
    { email: "juili.satao@zomato.com", name: "Juili Satao", score: 18.0 },
    { email: "kevin.kotak@zomato.com", name: "Kevin Kotak", score: 17.4 },
    { email: "sakshi.pare@zomato.com", name: "Sakshi Pare", score: 16.8 },
    { email: "upadhyay.satyam@zomato.com", name: "Upadhyay Satyam", score: 15.6 },
    { email: "khushi.kariya@zomato.com", name: "Khushi Kariya", score: 14.9 },
    { email: "anirudha.gupta@zomato.com", name: "Anirudha Gupta", score: 12.0 },
    { email: "desale.tejaswini@zomato.com", name: "Desale Tejaswini", score: 11.6 },
    { email: "bicky.rai@zomato.com", name: "Bicky Rai", score: 9.7 },
    { email: "deepika.chittella@zomato.com", name: "Deepika Chittella", score: 7.8 },
    { email: "prerna.kadam@zomato.com", name: "Prerna Kadam", score: 4.1 },
    { email: "parish.rathod@zomato.com", name: "Parish Rathod", score: 3.7 },
  ];

  // Top 6 KAMs for display
  const topKAMs = allKAMs.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <ZomatomLogo size="sm" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-foreground truncate">
                  BAU Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Business Operations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
              <Button
                onClick={() => navigate("/live-sprints")}
                variant="outline"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
                size="sm"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">View Live Sprints</span>
                <span className="sm:hidden">Sprints</span>
              </Button>
              <DarkModeToggle />
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
                size="sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Top Performance Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          {/* Current/Live Drives */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Current / Live Drives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* NCN Drive */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground flex-shrink-0">
                    1
                  </span>
                  <span className="font-medium text-xs sm:text-sm break-words">
                    NCN - No Cooking November
                  </span>
                </div>
                <div className="pl-5 sm:pl-7 space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-muted-foreground break-words min-w-0">
                      Overall OV Coverage
                    </span>
                    <StatusPill
                      relativeVariant
                      value={37.42}
                      allValues={[37.42, 31.77]}
                      className="text-xs flex-shrink-0"
                    >
                      37.42%
                    </StatusPill>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-muted-foreground break-words min-w-0">
                      Overall Res Coverage
                    </span>
                    <StatusPill
                      relativeVariant
                      value={31.77}
                      allValues={[37.42, 31.77]}
                      className="text-xs flex-shrink-0"
                    >
                      31.77%
                    </StatusPill>
                  </div>
                </div>
              </div>

              {/* N2R Drive */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground flex-shrink-0">
                    2
                  </span>
                  <span className="font-medium text-xs sm:text-sm break-words">
                    N2R - New To Restaurant
                  </span>
                </div>
                <div className="pl-5 sm:pl-7 space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-muted-foreground break-words min-w-0">
                      LA OV Conversion
                    </span>
                    <StatusPill
                      relativeVariant
                      value={31.3}
                      allValues={[31.3, 25.3, 18.2]}
                      className="text-xs flex-shrink-0"
                    >
                      31.3%
                    </StatusPill>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-muted-foreground break-words min-w-0">
                      MM OV Conversion
                    </span>
                    <StatusPill
                      relativeVariant
                      value={25.3}
                      allValues={[31.3, 25.3, 18.2]}
                      className="text-xs flex-shrink-0"
                    >
                      25.3%
                    </StatusPill>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-muted-foreground break-words min-w-0">
                      UM OV Conversion
                    </span>
                    <StatusPill
                      relativeVariant
                      value={18.2}
                      allValues={[31.3, 25.3, 18.2]}
                      className="text-xs flex-shrink-0"
                    >
                      18.2%
                    </StatusPill>
                  </div>
                </div>
              </div>

              {/* Items >=159 Drive */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground flex-shrink-0">
                    3
                  </span>
                  <span className="font-medium text-xs sm:text-sm break-words">Items &gt;=159</span>
                </div>
                <div className="pl-5 sm:pl-7 space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-muted-foreground break-words min-w-0">Conversion %</span>
                    <StatusPill
                      relativeVariant
                      value={14.34}
                      allValues={[14.34]}
                      className="text-xs flex-shrink-0"
                    >
                      14.34%
                    </StatusPill>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* City View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-words">City View</span>
              </CardTitle>
              <CardDescription className="break-words">
                Grow Max Coverage - Top 7 Cities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {(() => {
                const cities = [
                  { name: "Chennai", score: 55.5 },
                  { name: "Delhi", score: 52.1 },
                  { name: "Kolkata", score: 52.0 },
                  { name: "Mumbai", score: 49.3 },
                  { name: "Bengaluru", score: 45.2 },
                  { name: "Hyderabad", score: 35.2 },
                  { name: "Pune", score: 33.3 },
                ];
                const cityScores = cities.map((c) => c.score);
                return cities.map((city) => (
                  <div key={city.name} className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm break-words min-w-0">{city.name}</span>
                    <StatusPill
                      relativeVariant
                      value={city.score}
                      allValues={cityScores}
                      className="flex-shrink-0"
                    >
                      {city.score}%
                    </StatusPill>
                  </div>
                ));
              })()}
            </CardContent>
          </Card>

          {/* Zone View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-words">Zone View</span>
              </CardTitle>
              <CardDescription className="break-words">
                Grow Max Coverage - All Teams in Pune
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {(() => {
                const zones = [
                  { name: "CKA", score: 44.6 },
                  { name: "Central Pune", score: 35.61 },
                  { name: "East Pune", score: 27.73 },
                  { name: "North West Pune", score: 27.4 },
                  { name: "PCMC", score: 22.61 },
                  { name: "South Pune", score: 23.83 },
                ];
                const zoneScores = zones.map((z) => z.score);
                return zones.map((zone) => (
                  <div key={zone.name} className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm break-words min-w-0">{zone.name}</span>
                    <StatusPill
                      relativeVariant
                      value={zone.score}
                      allValues={zoneScores}
                      className="flex-shrink-0"
                    >
                      {zone.score}%
                    </StatusPill>
                  </div>
                ));
              })()}
            </CardContent>
          </Card>

          {/* KAM View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">KAM View</CardTitle>
              <CardDescription className="break-words">
                Grow Max Coverage - Top KAMs in Pune
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {(() => {
                const kamScores = topKAMs.map((k) => k.score);
                return topKAMs.map((kam) => (
                  <div key={kam.email} className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm break-words min-w-0">{kam.name}</span>
                    <StatusPill
                      relativeVariant
                      value={kam.score}
                      allValues={kamScores}
                      className="flex-shrink-0"
                    >
                      {kam.score}%
                    </StatusPill>
                  </div>
                ));
              })()}
              <Button
                onClick={() => setShowAllKAMs(true)}
                variant="link"
                className="text-primary p-0 h-auto gap-1 text-xs sm:text-sm"
              >
                View More
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid - Aligned with Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          {/* Past Drives */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base">Past Drives</CardTitle>
            </CardHeader>
            <CardContent className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium break-words">MRP Drive</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Sept 2025</p>
                </div>
                <StatusPill autoVariant value={45} className="text-xs flex-shrink-0">
                  45%
                </StatusPill>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Drives */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base">Upcoming Drives</CardTitle>
            </CardHeader>
            <CardContent className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium break-words">End Game</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Dec 2025</p>
                </div>
                <StatusPill type="neutral" className="text-xs flex-shrink-0">
                  Scheduled
                </StatusPill>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Portfolio Section - Full Width CTA */}
        <Card
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate("/kam-hub")}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1 break-words">
                    My Portfolio
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">
                    View and manage all restaurants with search and filtering
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="gap-2 group-hover:gap-3 transition-all w-full sm:w-auto text-sm sm:text-base"
              >
                View Portfolio
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* View All KAMs Dialog */}
      <Dialog open={showAllKAMs} onOpenChange={setShowAllKAMs}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl">
              All KAMs - Grow Max Coverage
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Complete list of KAMs in Pune with GM Coverage %
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {(() => {
              const allKamScores = allKAMs.map((k) => k.score);
              return allKAMs.map((kam, index) => (
                <div
                  key={kam.email}
                  className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors gap-2"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-semibold text-muted-foreground w-6 sm:w-8 flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium break-words">{kam.name}</p>
                      <p className="text-xs text-muted-foreground break-all">{kam.email}</p>
                    </div>
                  </div>
                  <StatusPill
                    relativeVariant
                    value={kam.score}
                    allValues={allKamScores}
                    className="flex-shrink-0"
                  >
                    {kam.score}%
                  </StatusPill>
                </div>
              ));
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainDashboard;
