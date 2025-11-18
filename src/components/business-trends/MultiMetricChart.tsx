/**
 * Multi-Metric Comparison Chart
 * Displays multiple metrics on the same chart for comparison
 */

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RestaurantMetrics, MetricType } from "@/types/businessTrends";
import { getMetricMetadata, getMetricChartColor, QUARTER_LABELS } from "@/utils/metricMetadata";

interface MultiMetricChartProps {
  metrics: RestaurantMetrics;
  selectedMetrics: MetricType[];
  title?: string;
}

export function MultiMetricChart({
  metrics,
  selectedMetrics,
  title = "Multi-Metric Comparison",
}: MultiMetricChartProps) {
  // Get all quarters
  const quarters = Object.keys(metrics.OV.quarterly);

  // Transform data for chart
  const chartData = quarters.map((quarter) => {
    const dataPoint: any = {
      quarter: QUARTER_LABELS[quarter] || quarter,
      fullQuarter: quarter,
    };

    selectedMetrics.forEach((metricType) => {
      dataPoint[metricType] =
        metrics[metricType].quarterly[quarter as keyof typeof metrics.OV.quarterly];
    });

    return dataPoint;
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
          <p className="font-semibold text-sm mb-2">{data.fullQuarter}</p>
          {payload.map((entry: any, index: number) => {
            const metadata = getMetricMetadata(entry.dataKey as MetricType);
            return (
              <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1">
                <span className="text-muted-foreground">{metadata.label}:</span>
                <span className="font-bold" style={{ color: entry.color }}>
                  {metadata.format(entry.value)}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Comparing {selectedMetrics.length} metrics across quarters
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="quarter"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => getMetricMetadata(value as MetricType).label}
              />
              {selectedMetrics.map((metricType) => (
                <Line
                  key={metricType}
                  type="monotone"
                  dataKey={metricType}
                  stroke={getMetricChartColor(metricType)}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1000}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* Metric Legend with Colors */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedMetrics.map((metricType) => {
              const metadata = getMetricMetadata(metricType);
              return (
                <div key={metricType} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getMetricChartColor(metricType) }}
                  />
                  <div className="text-xs">
                    <p className="font-semibold">{metadata.label}</p>
                    <p className="text-muted-foreground text-[10px]">{metadata.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
