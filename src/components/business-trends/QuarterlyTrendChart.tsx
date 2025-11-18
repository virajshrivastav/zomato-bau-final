/**
 * Quarterly Trend Chart Component
 * Displays line chart showing metric trends across quarters
 */

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MetricData, MetricType, Quarter } from "@/types/businessTrends";
import { getMetricMetadata, getMetricChartColor, QUARTER_LABELS } from "@/utils/metricMetadata";

interface QuarterlyTrendChartProps {
  metricType: MetricType;
  data: MetricData;
  chartType?: "line" | "area";
}

export function QuarterlyTrendChart({
  metricType,
  data,
  chartType = "area",
}: QuarterlyTrendChartProps) {
  const metadata = getMetricMetadata(metricType);
  const color = getMetricChartColor(metricType);

  // Transform data for chart
  const chartData = Object.entries(data.quarterly).map(([quarter, value]) => ({
    quarter: QUARTER_LABELS[quarter] || quarter,
    value: value,
    fullQuarter: quarter,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm mb-1">{data.fullQuarter}</p>
          <p className="text-sm text-muted-foreground">
            {metadata.label}: <span className="font-bold">{metadata.format(data.value)}</span>
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
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {metadata.label} - Quarterly Trend
          </CardTitle>
          <p className="text-sm text-muted-foreground">{metadata.description}</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            {chartType === "area" ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${metricType}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="quarter"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => metadata.format(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={3}
                  fill={`url(#gradient-${metricType})`}
                  animationDuration={1000}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="quarter"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => metadata.format(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={3}
                  dot={{ fill: color, r: 5 }}
                  activeDot={{ r: 7 }}
                  animationDuration={1000}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
