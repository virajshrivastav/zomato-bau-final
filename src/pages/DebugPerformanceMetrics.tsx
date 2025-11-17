import { useAuth } from "@/contexts/AuthContext";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle } from "@/components/DarkModeToggle";

/**
 * Debug page to check Performance Metrics data loading
 */
export default function DebugPerformanceMetrics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ncn, n2r, items, isLoading, error } = usePerformanceMetrics(user?.email || "");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Performance Metrics Debug</h1>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Button onClick={() => navigate("/kam-analytics")}>Go to KAM Analytics</Button>
          </div>
        </div>

        {/* Auth Info */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <strong>User:</strong> {user ? "Logged in" : "Not logged in"}
              </div>
              <div>
                <strong>Email:</strong> {user?.email || "N/A"}
              </div>
              <div>
                <strong>User ID:</strong> {user?.id || "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Query Status */}
        <Card>
          <CardHeader>
            <CardTitle>Query Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Overall Loading:</strong> {isLoading ? "Yes" : "No"}
              </div>
              <div>
                <strong>Overall Error:</strong> {error ? String(error) : "None"}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                {/* NCN */}
                <div className="border p-4 rounded">
                  <h3 className="font-bold mb-2">NCN</h3>
                  <div className="text-sm space-y-1">
                    <div>Loading: {ncn.isLoading ? "Yes" : "No"}</div>
                    <div>Error: {ncn.error ? "Yes" : "No"}</div>
                    <div>Data: {ncn.data ? "Yes" : "No"}</div>
                    <div>Status: {ncn.status}</div>
                  </div>
                </div>

                {/* N2R */}
                <div className="border p-4 rounded">
                  <h3 className="font-bold mb-2">N2R</h3>
                  <div className="text-sm space-y-1">
                    <div>Loading: {n2r.isLoading ? "Yes" : "No"}</div>
                    <div>Error: {n2r.error ? "Yes" : "No"}</div>
                    <div>Data: {n2r.data ? "Yes" : "No"}</div>
                    <div>Status: {n2r.status}</div>
                  </div>
                </div>

                {/* Items */}
                <div className="border p-4 rounded">
                  <h3 className="font-bold mb-2">Items</h3>
                  <div className="text-sm space-y-1">
                    <div>Loading: {items.isLoading ? "Yes" : "No"}</div>
                    <div>Error: {items.error ? "Yes" : "No"}</div>
                    <div>Data: {items.data ? "Yes" : "No"}</div>
                    <div>Status: {items.status}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NCN Data */}
        {ncn.data && (
          <Card>
            <CardHeader>
              <CardTitle>NCN Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto">{JSON.stringify(ncn.data, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        {/* N2R Data */}
        {n2r.data && (
          <Card>
            <CardHeader>
              <CardTitle>N2R Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto">{JSON.stringify(n2r.data, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        {/* Items Data */}
        {items.data && (
          <Card>
            <CardHeader>
              <CardTitle>Items Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto">{JSON.stringify(items.data, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        {/* Errors */}
        {(ncn.error || n2r.error || items.error) && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-500">Errors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ncn.error && (
                <div>
                  <strong>NCN Error:</strong>
                  <pre className="text-xs mt-2">{JSON.stringify(ncn.error, null, 2)}</pre>
                </div>
              )}
              {n2r.error && (
                <div>
                  <strong>N2R Error:</strong>
                  <pre className="text-xs mt-2">{JSON.stringify(n2r.error, null, 2)}</pre>
                </div>
              )}
              {items.error && (
                <div>
                  <strong>Items Error:</strong>
                  <pre className="text-xs mt-2">{JSON.stringify(items.error, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
