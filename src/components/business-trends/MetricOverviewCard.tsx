/**
 * Metric Overview Card Component
 * Displays a single metric's current value and growth indicators
 */

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MetricData, MetricType } from "@/types/businessTrends";
import { getMetricMetadata, getGrowthColor } from "@/utils/metricMetadata";
import { parseGrowth } from "@/utils/parseTrendsData";

interface MetricOverviewCardProps {
  metricType: MetricType;
  data: MetricData;
  index: number;
}

export function MetricOverviewCard({ metricType, data, index }: MetricOverviewCardProps) {
  const metadata = getMetricMetadata(metricType);
  const currentValue = data.quarterly["JAS 25"];

  // Parse growth comparisons
  const qoqGrowth = parseGrowth(data.growth.qoq_growth, metricType);
  const yoyGrowth = parseGrowth(data.growth.jas25_vs_jas24, metricType);

  const getTrendIcon = (direction: "up" | "down" | "neutral") => {
    if (direction === "up") return <TrendingUp className="w-4 h-4" />;
    if (direction === "down") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metadata.label}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{metadata.description}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {metadata.key}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Current Value */}
          <div className="mb-4">
            <motion.div
              className="text-3xl font-bold text-foreground"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            >
              {metadata.format(currentValue)}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">Q3 2025 (JAS 25)</p>
          </div>

          {/* Growth Indicators */}
          <div className="space-y-2">
            {/* QoQ Growth */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">QoQ Growth</span>
              <div
                className={`flex items-center gap-1 font-semibold ${getGrowthColor(
                  qoqGrowth.isPositive,
                  metadata.reverseColors
                )}`}
              >
                {getTrendIcon(qoqGrowth.direction)}
                <span>{Math.abs(qoqGrowth.value).toFixed(1)}%</span>
              </div>
            </div>

            {/* YoY Growth */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">YoY Growth</span>
              <div
                className={`flex items-center gap-1 font-semibold ${getGrowthColor(
                  yoyGrowth.isPositive,
                  metadata.reverseColors
                )}`}
              >
                {getTrendIcon(yoyGrowth.direction)}
                <span>{Math.abs(yoyGrowth.value).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
