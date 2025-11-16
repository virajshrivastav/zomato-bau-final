import { ManagementCard } from "@/components/temp/ui/ManagementCard";
import { ToggleButtonGroup } from "@/components/temp/ui/ToggleButtonGroup";
import { N2RData } from "@/types/restaurantTemp";
import { useState, useEffect } from "react";
import { useUpdateN2RApproached, useUpdateN2RConverted } from "@/hooks/useDriveSheetMutations";
import { useToast } from "@/hooks/use-toast";

interface N2RManagementCardProps {
  data: N2RData;
  resId: string;
}

export const N2RManagementCard = ({ data: initialData, resId }: N2RManagementCardProps) => {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();

  // Sync local state with prop changes (e.g., after refetch on sign in)
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Mutation hooks
  const updateApproached = useUpdateN2RApproached();
  const updateConverted = useUpdateN2RConverted();

  const handleApproachedChange = (value: string) => {
    const approached = value as "yes" | "no";
    setData({ ...data, approached });

    // Save to database
    updateApproached.mutate(
      { resId, approached },
      {
        onSuccess: () => {
          toast({
            title: "Saved",
            description: "N2R approached status updated",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save: ${error.message}`,
            variant: "destructive",
          });
          // Revert on error
          setData({ ...data, approached: initialData.approached });
        },
      }
    );
  };

  const handleConvertedChange = (value: string) => {
    const converted = value as "yes" | "wip" | "no";
    setData({ ...data, converted });

    // Save to database
    updateConverted.mutate(
      { resId, converted },
      {
        onSuccess: () => {
          toast({
            title: "Saved",
            description: "N2R converted status updated",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save: ${error.message}`,
            variant: "destructive",
          });
          // Revert on error
          setData({ ...data, converted: initialData.converted });
        },
      }
    );
  };

  return (
    <ManagementCard title="N2R" subtitle="New To Restaurant">
      {/* Current Codes */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Current Codes</h4>
        <div className="grid grid-cols-3 gap-2">
          {/* LA */}
          <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 hover:shadow-sm transition-all">
            <div className="text-center text-xs font-bold text-green-700 dark:text-green-400 mb-2">
              LA
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              AOV:{" "}
              <span className="font-semibold text-foreground">₹{data.currentCodes.la.aov}</span>
            </div>
            <div className="text-[10px] text-foreground bg-card p-2 rounded border border-border break-words">
              {data.currentCodes.la.currentCode}
            </div>
          </div>

          {/* MM */}
          <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 hover:shadow-sm transition-all">
            <div className="text-center text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">
              MM
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              AOV:{" "}
              <span className="font-semibold text-foreground">₹{data.currentCodes.mm.aov}</span>
            </div>
            <div className="text-[10px] text-foreground bg-card p-2 rounded border border-border break-words">
              {data.currentCodes.mm.currentCode}
            </div>
          </div>

          {/* UM */}
          <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 hover:shadow-sm transition-all">
            <div className="text-center text-xs font-bold text-purple-700 dark:text-purple-400 mb-2">
              UM
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              AOV:{" "}
              <span className="font-semibold text-foreground">₹{data.currentCodes.um.aov}</span>
            </div>
            <div className="text-[10px] text-foreground bg-card p-2 rounded border border-border break-words">
              {data.currentCodes.um.currentCode}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Codes */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Suggested Codes</h4>
        <div className="grid grid-cols-3 gap-2">
          {/* LA */}
          <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 hover:shadow-sm transition-all">
            <div className="text-center text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
              LA
            </div>
            <div className="text-[10px] space-y-1">
              <div>
                <span className="text-muted-foreground">Construct:</span>
                <div className="font-semibold text-foreground">
                  {data.suggestedCodes.la.construct}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">MOV:</span>
                <div className="font-semibold text-foreground">{data.suggestedCodes.la.mov}</div>
              </div>
            </div>
          </div>

          {/* MM */}
          <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/20 dark:to-teal-900/10 hover:shadow-sm transition-all">
            <div className="text-center text-xs font-bold text-teal-700 dark:text-teal-400 mb-2">
              MM
            </div>
            <div className="text-[10px] space-y-1">
              <div>
                <span className="text-muted-foreground">Construct:</span>
                <div className="font-semibold text-foreground">
                  {data.suggestedCodes.mm.construct}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">MOV:</span>
                <div className="font-semibold text-foreground">{data.suggestedCodes.mm.mov}</div>
              </div>
            </div>
          </div>

          {/* UM */}
          <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/20 dark:to-rose-900/10 hover:shadow-sm transition-all">
            <div className="text-center text-xs font-bold text-rose-700 dark:text-rose-400 mb-2">
              UM
            </div>
            <div className="text-[10px] space-y-1">
              <div>
                <span className="text-muted-foreground">Construct:</span>
                <div className="font-semibold text-foreground">
                  {data.suggestedCodes.um.construct}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">MOV:</span>
                <div className="font-semibold text-foreground">{data.suggestedCodes.um.mov}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Req. Coupons */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Req. Coupons</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 border border-border rounded-lg bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground">LA</div>
            <div className="text-sm font-bold text-foreground">{data.reqCoupons.la}</div>
          </div>
          <div className="p-2 border border-border rounded-lg bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground">MM</div>
            <div className="text-sm font-bold text-foreground">{data.reqCoupons.mm}</div>
          </div>
          <div className="p-2 border border-border rounded-lg bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground">UM</div>
            <div className="text-sm font-bold text-foreground">{data.reqCoupons.um}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <ToggleButtonGroup
          label="Approached"
          value={data.approached}
          onChange={handleApproachedChange}
          options={["yes", "no"]}
        />
        <ToggleButtonGroup
          label="Converted"
          value={data.converted}
          onChange={handleConvertedChange}
          options={["yes", "wip", "no"]}
        />
      </div>
    </ManagementCard>
  );
};
