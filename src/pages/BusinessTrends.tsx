/**
 * Business Trends Dashboard Page
 * Displays long-term business trends for restaurants across multiple quarters
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, TrendingUp, Building2, MapPin, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { MetricOverviewCard } from "@/components/business-trends/MetricOverviewCard";
import { QuarterlyTrendChart } from "@/components/business-trends/QuarterlyTrendChart";
import { GrowthComparisonChart } from "@/components/business-trends/GrowthComparisonChart";
import { MultiMetricChart } from "@/components/business-trends/MultiMetricChart";
import { RestaurantTrendsData, MetricType } from "@/types/businessTrends";
import { parseTrendsCSV } from "@/utils/parseTrendsData";

const BusinessTrends = () => {
  const navigate = useNavigate();
  const [trendsData, setTrendsData] = useState<RestaurantTrendsData[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantTrendsData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("OV");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load CSV data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/business-trends-data.csv");
        const csvText = await response.text();
        const parsed = parseTrendsCSV(csvText);
        setTrendsData(parsed);
        if (parsed.length > 0) {
          setSelectedRestaurant(parsed[0]);
        }
        setError(null);
      } catch (err) {
        console.error("Error loading trends data:", err);
        setError("Failed to load business trends data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading business trends data...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedRestaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Data</h1>
          <p className="text-muted-foreground mb-4">{error || "No data available"}</p>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const allMetrics: MetricType[] = ["OV", "CV", "MVD", "ZVD", "ADS", "CMPO"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/80"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Long Term Business Trends
                </h1>
                <p className="text-sm text-muted-foreground">
                  Quarterly performance analysis across 6 key metrics
                </p>
              </div>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Restaurant Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Restaurant</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedRestaurant.restaurant.res_id}
                onValueChange={(resId) => {
                  const restaurant = trendsData.find((r) => r.restaurant.res_id === resId);
                  if (restaurant) setSelectedRestaurant(restaurant);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {trendsData.map((data) => (
                    <SelectItem key={data.restaurant.res_id} value={data.restaurant.res_id}>
                      {data.restaurant.res_name} - {data.restaurant.primary_cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Restaurant Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cuisine</p>
                    <p className="font-semibold">{selectedRestaurant.restaurant.primary_cuisine}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold">
                      {selectedRestaurant.restaurant.subzone}, {selectedRestaurant.restaurant.zone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Account Manager</p>
                    <p className="font-semibold text-xs">
                      {selectedRestaurant.restaurant.account_manager}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metrics Overview Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold mb-4">Metrics Overview - Q3 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allMetrics.map((metricType, index) => (
              <MetricOverviewCard
                key={metricType}
                metricType={metricType}
                data={selectedRestaurant.metrics[metricType]}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Detailed Analysis Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto">
              <TabsTrigger value="individual">Individual Metrics</TabsTrigger>
              <TabsTrigger value="comparison">Multi-Metric Comparison</TabsTrigger>
            </TabsList>

            {/* Individual Metric Analysis */}
            <TabsContent value="individual" className="space-y-6 mt-6">
              {/* Metric Selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Metric to Analyze</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allMetrics.map((metric) => (
                      <Button
                        key={metric}
                        variant={selectedMetric === metric ? "default" : "outline"}
                        onClick={() => setSelectedMetric(metric)}
                        className="flex-1 min-w-[100px]"
                      >
                        {metric}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Charts for Selected Metric */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuarterlyTrendChart
                  metricType={selectedMetric}
                  data={selectedRestaurant.metrics[selectedMetric]}
                  chartType="area"
                />
                <GrowthComparisonChart
                  metricType={selectedMetric}
                  data={selectedRestaurant.metrics[selectedMetric]}
                />
              </div>
            </TabsContent>

            {/* Multi-Metric Comparison */}
            <TabsContent value="comparison" className="space-y-6 mt-6">
              <MultiMetricChart
                metrics={selectedRestaurant.metrics}
                selectedMetrics={["OV", "CV"]}
                title="Order Volume vs Commissionable Value"
              />
              <MultiMetricChart
                metrics={selectedRestaurant.metrics}
                selectedMetrics={["MVD", "ZVD"]}
                title="Merchant Discount vs Zomato Discount"
              />
              <MultiMetricChart
                metrics={selectedRestaurant.metrics}
                selectedMetrics={["ADS", "CMPO"]}
                title="Advertisements vs Cost Margin Per Order"
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default BusinessTrends;
