import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, TrendingUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { motion } from "framer-motion";
import EnhancedLeaderboardBar from "@/components/live-sprints/EnhancedLeaderboardBar";
import EnhancedPodiumDisplay from "@/components/live-sprints/EnhancedPodiumDisplay";
import LiveIndicator from "@/components/live-sprints/LiveIndicator";
import AnimatedNumber from "@/components/live-sprints/AnimatedNumber";

interface ZonalHead {
  name: string;
  achievement: number;
  rank: number;
  zone: string;
}

const LiveSprints = () => {
  const navigate = useNavigate();

  const participants: ZonalHead[] = [
    { name: "pandey.adarsh@zomato.com", achievement: 105.1, rank: 1, zone: "PCMC" },
    { name: "tanush.pasari@zomato.com", achievement: 102.0, rank: 2, zone: "East Pune" },
    { name: "paliwal.grasim@zomato.com", achievement: 99.2, rank: 3, zone: "East Pune" },
    { name: "sakshi.pare@zomato.com", achievement: 98.0, rank: 4, zone: "North West Pune" },
    { name: "utkarsh.narnaware@zomato.com", achievement: 94.3, rank: 5, zone: "North West Pune" },
    { name: "shriniwas.bewoor@zomato.com", achievement: 93.3, rank: 6, zone: "North West Pune" },
    { name: "rinkel.shah@zomato.com", achievement: 92.6, rank: 7, zone: "CKA" },
    { name: "rakesh.hati@zomato.com", achievement: 90.4, rank: 8, zone: "East Pune" },
    { name: "pranav.salvi@zomato.com", achievement: 90.0, rank: 9, zone: "Central Pune" },
    { name: "priya.joseph@zomato.com", achievement: 89.9, rank: 10, zone: "East Pune" },
  ];

  const topThree = participants.slice(0, 3);
  const avgAchievement = 82.2;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation Header */}
      <motion.header
        className="bg-card border-b border-border sticky top-0 z-50 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="hover:bg-muted"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </motion.div>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl font-bold text-foreground">Live Sprints</h1>
                  <p className="text-xs text-muted-foreground">Real-time performance tracking</p>
                </div>
                <LiveIndicator />
              </div>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </motion.header>

      {/* Header Section */}
      <motion.div
        className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b-4 border-primary/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-2 flex items-center gap-3">
                Pune Live Sprints
                <motion.span
                  className="text-6xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                >
                  🏁
                </motion.span>
              </h1>
              <p className="text-muted-foreground text-lg">ADS Achievement - November</p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="flex gap-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 bg-card/50 backdrop-blur">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Target className="w-4 h-4" />
                    Target
                  </div>
                  <div className="text-2xl font-bold text-foreground">100%</div>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 bg-card/50 backdrop-blur">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Average
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    <AnimatedNumber value={avgAchievement} suffix="%" />
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-12">
        {/* Podium Display */}
        <EnhancedPodiumDisplay first={topThree[0]} second={topThree[1]} third={topThree[2]} />

        {/* Main Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card className="p-8 shadow-2xl bg-card/80 backdrop-blur">
            <motion.div
              className="flex items-center gap-2 mb-8"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold text-foreground">Achievement Leaderboard</h2>
            </motion.div>

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
                    <EnhancedLeaderboardBar
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
            <motion.div
              className="mt-12 pt-6 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-6 flex-wrap">
                {[
                  { color: "bg-gold", label: "1st Place" },
                  { color: "bg-silver", label: "2nd Place" },
                  { color: "bg-bronze", label: "3rd Place" },
                  { color: "bg-race-blue", label: "Competing" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center gap-2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 2 + index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className={`w-4 h-4 rounded ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <motion.p
            className="text-lg text-muted-foreground italic"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            "Every step forward counts. Keep pushing towards 100%! 💪"
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LiveSprints;
