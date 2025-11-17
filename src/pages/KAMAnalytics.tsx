import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Activity,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DarkModeToggle } from "@/components/DarkModeToggle";

/**
 * KAM Analytics Page - Performance Metrics
 *
 * Displays drive-wise performance summaries for:
 * - NCN Drive (Stepper/Base coverage, Flash Sale, BOGO, Overall metrics)
 * - N2R Drive (OV Conversion metrics for LA, MM, UM)
 * - Items Drive (Weekly trends for OV Coverage and Items Count)
 *
 * Data is filtered by logged-in KAM email.
 */

const KAMAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  console.log("🔍 KAMAnalytics - User:", user);
  console.log("🔍 KAMAnalytics - User Email:", user?.email);

  // Fetch performance metrics for the logged-in KAM
  const { ncn, n2r, items, isLoading, error } = usePerformanceMetrics(user?.email || "");

  // Debug logging for queries
  console.log("📊 NCN Query:", { isLoading: ncn.isLoading, data: ncn.data, error: ncn.error });
  console.log("📊 N2R Query:", { isLoading: n2r.isLoading, data: n2r.data, error: n2r.error });
  console.log("📊 Items Query:", {
    isLoading: items.isLoading,
    data: items.data,
    error: items.error,
  });
  console.log("📊 Overall Loading:", isLoading);

  // Helper function to parse percentage strings to numbers
  const parsePercentage = (value: string | null): number => {
    if (!value) return 0;
    const match = value.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Helper function to parse number strings to integers
  const parseNumber = (value: string | null): number => {
    if (!value) return 0;
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Helper function to check if there's actual data (not all N/A)
  const hasActualData = (...values: (string | null)[]): boolean => {
    return values.some((val) => val && val !== "N/A" && val.trim() !== "");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Loading performance metrics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Metrics</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load performance metrics"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">KAM Analytics</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                <Target className="h-5 w-5" />
              </div>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        {/* Page Title and Strategize Button */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Performance Metrics</h1>
            <p className="text-muted-foreground mt-1">
              Drive-wise performance summaries for NCN, N2R, and Items
            </p>
          </div>
          <Button
            onClick={() => console.log("Strategize - coming soon")}
            size="lg"
            className="gap-2"
          >
            <Target className="w-4 h-4" />
            Strategize Now
          </Button>
        </div>

        {/* Performance Metrics Sections */}
        <div className="space-y-8">
          {/* NCN Drive Section */}
          {ncn.data ? (
            <Card className="shadow-elevated border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">NCN Drive Performance</CardTitle>
                <p className="text-sm text-muted-foreground">
                  New Customer Network - Coverage metrics
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stepper/Base Coverage Grid */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Stepper vs Base Coverage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* LA Coverage */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          LA (Low AOV)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Base:</span>
                          <span className="font-semibold">
                            {ncn.data.la_base_coverage || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Stepper:</span>
                          <span className="font-semibold">
                            {ncn.data.la_stepper_coverage || "N/A"}
                          </span>
                        </div>
                        {ncn.data.delta_la && (
                          <div className="text-xs text-muted-foreground pt-1 border-t">
                            Delta: {ncn.data.delta_la}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* MM Coverage */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          MM (Medium AOV)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Base:</span>
                          <span className="font-semibold">
                            {ncn.data.mm_base_coverage || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Stepper:</span>
                          <span className="font-semibold">
                            {ncn.data.mm_stepper_coverage || "N/A"}
                          </span>
                        </div>
                        {ncn.data.delta_mm && (
                          <div className="text-xs text-muted-foreground pt-1 border-t">
                            Delta: {ncn.data.delta_mm}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* UM Coverage */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          UM (Ultra AOV)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Base:</span>
                          <span className="font-semibold">
                            {ncn.data.um_base_coverage || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Stepper:</span>
                          <span className="font-semibold">
                            {ncn.data.um_stepper_coverage || "N/A"}
                          </span>
                        </div>
                        {ncn.data.delta_um && (
                          <div className="text-xs text-muted-foreground pt-1 border-t">
                            Delta: {ncn.data.delta_um}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Stepper vs Base Chart */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">
                        Stepper vs Base Coverage Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={[
                            {
                              name: "LA",
                              Base: parsePercentage(ncn.data.la_base_coverage),
                              Stepper: parsePercentage(ncn.data.la_stepper_coverage),
                            },
                            {
                              name: "MM",
                              Base: parsePercentage(ncn.data.mm_base_coverage),
                              Stepper: parsePercentage(ncn.data.mm_stepper_coverage),
                            },
                            {
                              name: "UM",
                              Base: parsePercentage(ncn.data.um_base_coverage),
                              Stepper: parsePercentage(ncn.data.um_stepper_coverage),
                            },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            opacity={0.3}
                          />
                          <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: "12px", fontWeight: 500 }}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: "12px", fontWeight: 500 }}
                            label={{ value: "Coverage (%)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "var(--radius)",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            formatter={(value: number) => `${value}%`}
                          />
                          <Legend />
                          <Bar dataKey="Base" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Stepper" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Other NCN Metrics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Other Coverage Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Flash Sale Coverage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {ncn.data.flash_sale_coverage || "N/A"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          BOGO OV Coverage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{ncn.data.bogo_ov_coverage || "N/A"}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Overall OV Coverage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {ncn.data.overall_ov_coverage || "N/A"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Overall Res Coverage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {ncn.data.overall_res_coverage || "N/A"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Other Metrics Chart */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">
                        Other Coverage Metrics Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={[
                            {
                              name: "Flash Sale",
                              value: parsePercentage(ncn.data.flash_sale_coverage),
                            },
                            {
                              name: "BOGO OV",
                              value: parsePercentage(ncn.data.bogo_ov_coverage),
                            },
                            {
                              name: "Overall OV",
                              value: parsePercentage(ncn.data.overall_ov_coverage),
                            },
                            {
                              name: "Overall Res",
                              value: parsePercentage(ncn.data.overall_res_coverage),
                            },
                          ]}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            opacity={0.3}
                          />
                          <XAxis
                            type="number"
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: "12px", fontWeight: 500 }}
                            label={{ value: "Coverage (%)", position: "insideBottom", offset: -5 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: "12px", fontWeight: 500 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "var(--radius)",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            formatter={(value: number) => `${value}%`}
                          />
                          <Bar dataKey="value" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  No NCN drive data available for your account
                </p>
              </CardContent>
            </Card>
          )}

          {/* N2R Drive Section */}
          {n2r.data ? (
            <Card className="shadow-elevated border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">N2R Drive Performance</CardTitle>
                <p className="text-sm text-muted-foreground">
                  New to Repeat - OV Conversion metrics
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* LA OV Conversion */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        LA OV Conversion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{n2r.data.la_ov_conversion || "N/A"}</p>
                    </CardContent>
                  </Card>

                  {/* MM OV Conversion */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        MM OV Conversion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{n2r.data.mm_ov_conversion || "N/A"}</p>
                    </CardContent>
                  </Card>

                  {/* UM OV Conversion */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        UM OV Conversion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{n2r.data.um_ov_conversion || "N/A"}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* N2R Conversion Chart */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      OV Conversion Rates by AOV Segment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          {
                            name: "LA",
                            value: parsePercentage(n2r.data.la_ov_conversion),
                          },
                          {
                            name: "MM",
                            value: parsePercentage(n2r.data.mm_ov_conversion),
                          },
                          {
                            name: "UM",
                            value: parsePercentage(n2r.data.um_ov_conversion),
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                          label={{ value: "Conversion (%)", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                          formatter={(value: number) => `${value}%`}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {[
                            {
                              name: "LA",
                              value: parsePercentage(n2r.data.la_ov_conversion),
                            },
                            {
                              name: "MM",
                              value: parsePercentage(n2r.data.mm_ov_conversion),
                            },
                            {
                              name: "UM",
                              value: parsePercentage(n2r.data.um_ov_conversion),
                            },
                          ].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.value >= 50
                                  ? "hsl(var(--chart-2))" // Green for >50%
                                  : entry.value >= 30
                                    ? "hsl(var(--chart-4))" // Yellow for 30-50%
                                    : "hsl(var(--chart-5))" // Red for <30%
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  No N2R drive data available for your account
                </p>
              </CardContent>
            </Card>
          )}

          {/* Items Drive Section */}
          {items.data ? (
            <Card className="shadow-elevated border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Items Drive Performance</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Items ≤159 - Weekly trends for OV Coverage and Items Count
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* OV Coverage Trend */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">OV Coverage Trend</h3>
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Baseline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.ov_baseline || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Week 41</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.ov_week41 || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Week 42</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.ov_week42 || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Week 43</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.ov_week43 || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Week 44</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.ov_week44 || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Delta</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.ov_delta || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">WoW</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.ov_wow || "N/A"}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* OV Coverage Line Chart - Only show if there's actual data */}
                  {hasActualData(
                    items.data.ov_baseline,
                    items.data.ov_week41,
                    items.data.ov_week42,
                    items.data.ov_week43,
                    items.data.ov_week44
                  ) && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-base font-semibold">
                          OV Coverage Trend Over Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                            data={[
                              {
                                week: "Baseline",
                                coverage: parsePercentage(items.data.ov_baseline),
                              },
                              {
                                week: "W41",
                                coverage: parsePercentage(items.data.ov_week41),
                              },
                              {
                                week: "W42",
                                coverage: parsePercentage(items.data.ov_week42),
                              },
                              {
                                week: "W43",
                                coverage: parsePercentage(items.data.ov_week43),
                              },
                              {
                                week: "W44",
                                coverage: parsePercentage(items.data.ov_week44),
                              },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="hsl(var(--border))"
                              opacity={0.3}
                            />
                            <XAxis
                              dataKey="week"
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: "12px", fontWeight: 500 }}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: "12px", fontWeight: 500 }}
                              label={{ value: "Coverage (%)", angle: -90, position: "insideLeft" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                              formatter={(value: number) => `${value}%`}
                            />
                            <Line
                              type="monotone"
                              dataKey="coverage"
                              stroke="hsl(var(--chart-1))"
                              strokeWidth={2}
                              dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Items Count Trend */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Items Count Trend</h3>
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Baseline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.items_baseline || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Week 41</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.items_week41 || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Week 42</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.items_week42 || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Week 43</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.items_week43 || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Week 44</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.items_week44 || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Delta</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.items_delta || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">WoW</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{items.data.items_wow || "N/A"}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Items Count Line Chart - Only show if there's actual data */}
                  {hasActualData(
                    items.data.items_baseline,
                    items.data.items_week41,
                    items.data.items_week42,
                    items.data.items_week43,
                    items.data.items_week44
                  ) && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-base font-semibold">
                          Items Count Trend Over Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                            data={[
                              {
                                week: "Baseline",
                                count: parseNumber(items.data.items_baseline),
                              },
                              {
                                week: "W41",
                                count: parseNumber(items.data.items_week41),
                              },
                              {
                                week: "W42",
                                count: parseNumber(items.data.items_week42),
                              },
                              {
                                week: "W43",
                                count: parseNumber(items.data.items_week43),
                              },
                              {
                                week: "W44",
                                count: parseNumber(items.data.items_week44),
                              },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="hsl(var(--border))"
                              opacity={0.3}
                            />
                            <XAxis
                              dataKey="week"
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: "12px", fontWeight: 500 }}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: "12px", fontWeight: 500 }}
                              label={{ value: "Items Count", angle: -90, position: "insideLeft" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                              formatter={(value: number) => `${value}`}
                            />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="hsl(var(--chart-3))"
                              strokeWidth={2}
                              dot={{ fill: "hsl(var(--chart-3))", r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  No Items drive data available for your account
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default KAMAnalytics;
