/**
 * Growth Comparison Chart Component
 * Displays bar chart comparing different growth metrics
 */

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MetricData, MetricType } from "@/types/businessTrends";
import { getMetricMetadata, getMetricChartColor } from "@/utils/metricMetadata";
import { parseGrowth } from "@/utils/parseTrendsData";

interface GrowthComparisonChartProps {
  metricType: MetricType;
  data: MetricData;
}

export function GrowthComparisonChart({ metricType, data }: GrowthComparisonChartProps) {
  const metadata = getMetricMetadata(metricType);
  const baseColor = getMetricChartColor(metricType);

  // Parse all growth comparisons
  const growthData = [
    {
      name: "QoQ",
      label: "Quarter on Quarter",
      ...parseGrowth(data.growth.qoq_growth, metricType),
    },
    {
      name: "YoY",
      label: "JAS 25 vs JAS 24",
      ...parseGrowth(data.growth.jas25_vs_jas24, metricType),
    },
    {
      name: "2Y",
      label: "JAS 25 vs JAS 23",
      ...parseGrowth(data.growth.jas25_vs_jas23, metricType),
    },
    {
      name: "YTD",
      label: "Jan-Sep 25 vs 24",
      ...parseGrowth(data.growth.jan_sept_25_vs_24, metricType),
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm mb-1">{data.label}</p>
          <p className="text-sm">
            Growth:{" "}
            <span className={`font-bold ${data.isPositive ? "text-green-600" : "text-red-600"}`}>
              {data.value > 0 ? "+" : ""}
              {data.value.toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {metadata.label} - Growth Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">Comparing different time periods</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={800}>
                {growthData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {growthData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor: item.isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)",
                  }}
                />
                <span className="text-muted-foreground">
                  {item.name}: {item.value > 0 ? "+" : ""}
                  {item.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
