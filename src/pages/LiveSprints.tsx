import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LeaderboardBar from "@/components/LeaderboardBar";
import PodiumDisplay from "@/components/PodiumDisplay";
import { Sparkles, Target, TrendingUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ZonalHead {
  name: string;
  achievement: number;
  rank: number;
  zone: string;
}

const LiveSprints = () => {
  const navigate = useNavigate();

  const participants: ZonalHead[] = [
    { name: "Arjun Mehta", achievement: 95, rank: 1, zone: "East Zone" },
    { name: "Sneha Kapoor", achievement: 80, rank: 2, zone: "East Zone" },
    { name: "Vikram Desai", achievement: 75, rank: 3, zone: "South Zone" },
    { name: "Neha Sharma", achievement: 60, rank: 4, zone: "Northwest Zone" },
    { name: "Rohan Gupta", achievement: 50, rank: 5, zone: "Northwest Zone" },
    { name: "Pooja Reddy", achievement: 30, rank: 6, zone: "PCMC Zone" },
    { name: "Karan Malhotra", achievement: 15, rank: 7, zone: "Central Zone" },
  ];

  const topThree = participants.slice(0, 3);
  const avgAchievement = Math.round(
    participants.reduce((sum, p) => sum + p.achievement, 0) / participants.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Live Sprints</h1>
              <p className="text-xs text-muted-foreground">Real-time performance tracking</p>
            </div>
          </div>
        </div>
      </header>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b-4 border-primary/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-2 flex items-center gap-3">
                Pune Live Sprints
                <span className="text-6xl animate-bounce">🏁</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Real-time performance tracking • Updated live
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <Card className="p-4 bg-card/50 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Target className="w-4 h-4" />
                  Target
                </div>
                <div className="text-2xl font-bold text-foreground">100%</div>
              </Card>
              <Card className="p-4 bg-card/50 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Average
                </div>
                <div className="text-2xl font-bold text-accent">{avgAchievement}%</div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Podium Display */}
        <PodiumDisplay first={topThree[0]} second={topThree[1]} third={topThree[2]} />

        {/* Main Chart Section */}
        <Card className="p-8 shadow-2xl bg-card/80 backdrop-blur">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Achievement Leaderboard</h2>
          </div>

          {/* Vertical Bar Chart with Y-Axis on Left */}
          <div className="relative flex gap-6">
            {/* Y-Axis (Left side) */}
            <div className="flex flex-col justify-between py-8" style={{ height: "400px" }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">100%</span>
                <div className="w-2 h-px bg-border" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">75%</span>
                <div className="w-2 h-px bg-border" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">50%</span>
                <div className="w-2 h-px bg-border" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">25%</span>
                <div className="w-2 h-px bg-border" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">0%</span>
                <div className="w-2 h-px bg-border" />
              </div>
              <div
                className="absolute left-0 -rotate-90 origin-left text-sm font-semibold text-muted-foreground whitespace-nowrap"
                style={{
                  top: "50%",
                  transform: "translateX(-80px) translateY(-50%) rotate(-90deg)",
                }}
              >
                Achievement %
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 relative">
              {/* 100% Reference Line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-primary/30 z-10">
                <span className="absolute -top-3 right-0 text-xs text-primary font-medium">
                  Target
                </span>
              </div>

              {/* Bars Container */}
              <div className="flex items-end justify-around gap-4 min-h-[400px] pt-8">
                {participants.map((participant, index) => (
                  <LeaderboardBar
                    key={index}
                    name={participant.name}
                    zone={participant.zone}
                    achievement={participant.achievement}
                    rank={participant.rank}
                    totalRanks={participants.length}
                  />
                ))}
              </div>

              {/* X-Axis Line */}
              <div className="mt-4 h-1 bg-border rounded-full" />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gold" />
                <span className="text-sm text-muted-foreground">1st Place</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-silver" />
                <span className="text-sm text-muted-foreground">2nd Place</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-bronze" />
                <span className="text-sm text-muted-foreground">3rd Place</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-race-blue" />
                <span className="text-sm text-muted-foreground">Competing</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Motivational Footer */}
        <div className="mt-8 text-center">
          <p className="text-lg text-muted-foreground italic">
            "Every step forward counts. Keep pushing towards 100%! 💪"
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            height: 0%;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveSprints;
