import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import MainDashboard from "./pages/MainDashboard";
import KAMHub from "./pages/KAMHub";
import RestaurantDetail from "./pages/RestaurantDetail";
import KAMAnalytics from "./pages/KAMAnalytics";
import ZonalHeadView from "./pages/ZonalHeadView";
import LiveSprints from "./pages/LiveSprints";
import DebugPerformanceMetrics from "./pages/DebugPerformanceMetrics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="zomato-dashboard-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Auth Page */}
              <Route path="/" element={<Auth />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kam-hub"
                element={
                  <ProtectedRoute>
                    <KAMHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/restaurant/:id"
                element={
                  <ProtectedRoute>
                    <RestaurantDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kam-analytics"
                element={
                  <ProtectedRoute>
                    <KAMAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/zonal-head-view"
                element={
                  <ProtectedRoute>
                    <ZonalHeadView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/live-sprints"
                element={
                  <ProtectedRoute>
                    <LiveSprints />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
