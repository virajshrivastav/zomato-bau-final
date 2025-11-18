import { ManagementCard } from "@/components/temp/ui/ManagementCard";
import { ToggleButtonGroup } from "@/components/temp/ui/ToggleButtonGroup";
import { NCNData } from "@/types/restaurantTemp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useUpdateNCNApproached,
  useUpdateNCNConverted,
  useUpdateNCNSelectedCodes,
} from "@/hooks/useDriveSheetMutations";
import { useToast } from "@/hooks/use-toast";

interface NCNManagementCardProps {
  data: NCNData;
  resId: string;
}

export const NCNManagementCard = ({ data: initialData, resId }: NCNManagementCardProps) => {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();

  // Sync local state with prop changes (e.g., after refetch on sign in)
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Mutation hooks
  const updateApproached = useUpdateNCNApproached();
  const updateConverted = useUpdateNCNConverted();
  const updateSelectedCodes = useUpdateNCNSelectedCodes();

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
            description: "NCN approached status updated",
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
            description: "NCN converted status updated",
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
    <ManagementCard title="NCN" subtitle="No Cooking November">
      {/* Priorities - 6 Equal Boxes */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Priorities</h4>
        <div className="grid grid-cols-2 gap-2">
          {data.priorities.map((priority, index) => (
            <div
              key={index}
              className="p-3 border border-border rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 text-center hover:shadow-sm transition-shadow"
            >
              <span className="text-xs font-medium text-foreground">
                {index + 1}. {priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Promos */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Active Promos</h4>
        <Button
          type="button"
          variant="outline"
          className="w-full hover:bg-primary/5 hover:border-primary/50 transition-colors"
          onClick={() => window.open(data.activePromosLink, "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Active Promos
        </Button>
      </div>

      {/* Suggested Promos */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Suggested Promos</h4>

        {/* 3 Rectangles - BOGO, Flash Sale, Salt */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 text-center hover:shadow-sm transition-all">
            <p className="text-xs font-semibold mb-2 text-orange-700 dark:text-orange-400">BOGO</p>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="text-xs h-auto p-0 text-orange-600 hover:text-orange-700 dark:text-orange-400"
              onClick={() => {
                // TODO: Show BOGO items list
                alert(`BOGO Items:\n${data.suggestedPromos.bogo.items.join("\n")}`);
              }}
            >
              View Items
            </Button>
          </div>
          <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 text-center hover:shadow-sm transition-all">
            <p className="text-xs font-semibold mb-2 text-purple-700 dark:text-purple-400">
              Flash Sale
            </p>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="text-xs h-auto p-0 text-purple-600 hover:text-purple-700 dark:text-purple-400"
              onClick={() => {
                // TODO: Show Flash Sale items list
                alert(`Flash Sale Items:\n${data.suggestedPromos.flashSale.items.join("\n")}`);
              }}
            >
              View Items
            </Button>
          </div>
          <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 text-center hover:shadow-sm transition-all">
            <p className="text-xs font-semibold mb-1 text-blue-700 dark:text-blue-400">Salt</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {data.suggestedPromos.salt.percentage}%
            </p>
          </div>
        </div>

        {/* Stepper and Base Codes */}
        <div className="mt-4 p-3 bg-card rounded-xl border border-border/30">
          <h5 className="text-xs font-semibold mb-3 text-foreground flex items-center gap-2">
            <span className="w-0.5 h-4 bg-primary rounded-full"></span>
            Stepper & Base Codes
          </h5>

          {/* LA / MM / UM Headers */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center text-sm font-bold text-white bg-[#e23744] py-2 px-3 rounded-lg shadow-sm">
              LA
            </div>
            <div className="text-center text-sm font-bold text-white bg-[#e23744] py-2 px-3 rounded-lg shadow-sm">
              MM
            </div>
            <div className="text-center text-sm font-bold text-white bg-[#e23744] py-2 px-3 rounded-lg shadow-sm">
              UM
            </div>
          </div>

          {/* Codes for each segment */}
          <div className="grid grid-cols-3 gap-3">
            {/* LA Codes */}
            <div className="space-y-2">
              {data.stepperAndBaseCodes.la.map((code) => (
                <div
                  key={code.id}
                  className="p-2 rounded-lg bg-muted/50 border border-border hover:border-border/80 transition-all duration-200"
                >
                  {/* Percentage-based code (base code) */}
                  {code.percentage !== undefined ? (
                    <>
                      {/* Radio button + Display in one line */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                la: data.stepperAndBaseCodes.la.map((c) =>
                                  c.id === code.id ? { ...c, selected: !c.selected } : c
                                ),
                              },
                            });
                          }}
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            code.selected
                              ? "bg-primary border-primary"
                              : "border-primary bg-transparent"
                          }`}
                        >
                          {code.selected && (
                            <svg
                              className="w-2.5 h-2.5 text-primary-foreground"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </button>
                        <span className="text-[11px] font-semibold text-primary truncate">
                          {code.percentage}% upto {code.maxAmount}rs
                        </span>
                      </div>
                      {/* Compact input fields */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <Input
                          type="number"
                          value={code.percentage}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                la: data.stepperAndBaseCodes.la.map((c) =>
                                  c.id === code.id
                                    ? { ...c, percentage: Number(e.target.value) }
                                    : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">%</span>
                        <span className="text-[10px] font-medium text-muted-foreground">upto</span>
                        <Input
                          type="number"
                          value={code.maxAmount}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                la: data.stepperAndBaseCodes.la.map((c) =>
                                  c.id === code.id ? { ...c, maxAmount: Number(e.target.value) } : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">rs</span>
                      </div>
                    </>
                  ) : (
                    /* Flat discount code (stepper code) */
                    <>
                      {/* Radio button + Display in one line */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                la: data.stepperAndBaseCodes.la.map((c) =>
                                  c.id === code.id ? { ...c, selected: !c.selected } : c
                                ),
                              },
                            });
                          }}
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            code.selected
                              ? "bg-primary border-primary"
                              : "border-primary bg-transparent"
                          }`}
                        >
                          {code.selected && (
                            <svg
                              className="w-2.5 h-2.5 text-primary-foreground"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </button>
                        <span className="text-[11px] font-semibold text-primary truncate">
                          Flat {code.flatOff}rs
                        </span>
                      </div>
                      {/* Compact input fields */}
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[10px] font-medium text-muted-foreground w-8">
                          Flat
                        </span>
                        <Input
                          type="number"
                          value={code.flatOff}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                la: data.stepperAndBaseCodes.la.map((c) =>
                                  c.id === code.id ? { ...c, flatOff: Number(e.target.value) } : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">rs</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="text-[10px] font-medium text-muted-foreground w-8">
                          MOV
                        </span>
                        <Input
                          type="number"
                          value={code.mov}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                la: data.stepperAndBaseCodes.la.map((c) =>
                                  c.id === code.id ? { ...c, mov: Number(e.target.value) } : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">rs</span>
                      </div>
                    </>
                  )}
                  <Badge
                    variant={code.status === "Picked" ? "default" : "outline"}
                    className="text-[9px] h-4 px-2 bg-primary hover:bg-primary border-none text-primary-foreground font-semibold"
                  >
                    {code.status}
                  </Badge>
                </div>
              ))}
            </div>

            {/* MM Codes */}
            <div className="space-y-2">
              {data.stepperAndBaseCodes.mm.map((code) => (
                <div
                  key={code.id}
                  className="p-2 rounded-lg bg-muted/50 border border-border hover:border-border/80 transition-all duration-200"
                >
                  {/* Percentage-based code (base code) */}
                  {code.percentage !== undefined ? (
                    <>
                      {/* Radio button + Display in one line */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                mm: data.stepperAndBaseCodes.mm.map((c) =>
                                  c.id === code.id ? { ...c, selected: !c.selected } : c
                                ),
                              },
                            });
                          }}
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            code.selected
                              ? "bg-primary border-primary"
                              : "border-primary bg-transparent"
                          }`}
                        >
                          {code.selected && (
                            <svg
                              className="w-2.5 h-2.5 text-primary-foreground"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </button>
                        <span className="text-[11px] font-semibold text-primary truncate">
                          {code.percentage}% upto {code.maxAmount}rs
                        </span>
                      </div>
                      {/* Compact input fields */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <Input
                          type="number"
                          value={code.percentage}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                mm: data.stepperAndBaseCodes.mm.map((c) =>
                                  c.id === code.id
                                    ? { ...c, percentage: Number(e.target.value) }
                                    : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">%</span>
                        <span className="text-[10px] font-medium text-muted-foreground">upto</span>
                        <Input
                          type="number"
                          value={code.maxAmount}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                mm: data.stepperAndBaseCodes.mm.map((c) =>
                                  c.id === code.id ? { ...c, maxAmount: Number(e.target.value) } : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">rs</span>
                      </div>
                    </>
                  ) : (
                    /* Flat discount code (stepper code) */
                    <>
                      {/* Radio button + Display in one line */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                mm: data.stepperAndBaseCodes.mm.map((c) =>
                                  c.id === code.id ? { ...c, selected: !c.selected } : c
                                ),
                              },
                            });
                          }}
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            code.selected
                              ? "bg-primary border-primary"
                              : "border-primary bg-transparent"
                          }`}
                        >
                          {code.selected && (
                            <svg
                              className="w-2.5 h-2.5 text-primary-foreground"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </button>
                        <span className="text-[11px] font-semibold text-primary truncate">
                          Flat {code.flatOff}rs
                        </span>
                      </div>
                      {/* Compact input fields */}
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[10px] font-medium text-muted-foreground w-8">
                          Flat
                        </span>
                        <Input
                          type="number"
                          value={code.flatOff}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                mm: data.stepperAndBaseCodes.mm.map((c) =>
                                  c.id === code.id ? { ...c, flatOff: Number(e.target.value) } : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">rs</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="text-[10px] font-medium text-muted-foreground w-8">
                          MOV
                        </span>
                        <Input
                          type="number"
                          value={code.mov}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                mm: data.stepperAndBaseCodes.mm.map((c) =>
                                  c.id === code.id ? { ...c, mov: Number(e.target.value) } : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">rs</span>
                      </div>
                    </>
                  )}
                  <Badge
                    variant={code.status === "Picked" ? "default" : "outline"}
                    className="text-[9px] h-4 px-2 bg-primary hover:bg-primary border-none text-primary-foreground font-semibold"
                  >
                    {code.status}
                  </Badge>
                </div>
              ))}
            </div>

            {/* UM Codes */}
            <div className="space-y-2">
              {data.stepperAndBaseCodes.um.map((code) => (
                <div
                  key={code.id}
                  className="p-2 rounded-lg bg-muted/50 border border-border hover:border-border/80 transition-all duration-200"
                >
                  {/* Percentage-based code (base code) */}
                  {code.percentage !== undefined ? (
                    <>
                      {/* Radio button + Display in one line */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                um: data.stepperAndBaseCodes.um.map((c) =>
                                  c.id === code.id ? { ...c, selected: !c.selected } : c
                                ),
                              },
                            });
                          }}
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            code.selected
                              ? "bg-primary border-primary"
                              : "border-primary bg-transparent"
                          }`}
                        >
                          {code.selected && (
                            <svg
                              className="w-2.5 h-2.5 text-primary-foreground"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </button>
                        <span className="text-[11px] font-semibold text-primary truncate">
                          {code.percentage}% upto {code.maxAmount}rs
                        </span>
                      </div>
                      {/* Compact input fields */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <Input
                          type="number"
                          value={code.percentage}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                um: data.stepperAndBaseCodes.um.map((c) =>
                                  c.id === code.id
                                    ? { ...c, percentage: Number(e.target.value) }
                                    : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">%</span>
                        <span className="text-[10px] font-medium text-muted-foreground">upto</span>
                        <Input
                          type="number"
                          value={code.maxAmount}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                um: data.stepperAndBaseCodes.um.map((c) =>
                                  c.id === code.id ? { ...c, maxAmount: Number(e.target.value) } : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">rs</span>
                      </div>
                    </>
                  ) : (
                    /* Flat discount code (stepper code) */
                    <>
                      {/* Radio button + Display in one line */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                um: data.stepperAndBaseCodes.um.map((c) =>
                                  c.id === code.id ? { ...c, selected: !c.selected } : c
                                ),
                              },
                            });
                          }}
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            code.selected
                              ? "bg-primary border-primary"
                              : "border-primary bg-transparent"
                          }`}
                        >
                          {code.selected && (
                            <svg
                              className="w-2.5 h-2.5 text-primary-foreground"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </button>
                        <span className="text-[11px] font-semibold text-primary truncate">
                          Flat {code.flatOff}rs
                        </span>
                      </div>
                      {/* Compact input fields */}
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[10px] font-medium text-muted-foreground w-8">
                          Flat
                        </span>
                        <Input
                          type="number"
                          value={code.flatOff}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                um: data.stepperAndBaseCodes.um.map((c) =>
                                  c.id === code.id ? { ...c, flatOff: Number(e.target.value) } : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">rs</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="text-[10px] font-medium text-muted-foreground w-8">
                          MOV
                        </span>
                        <Input
                          type="number"
                          value={code.mov}
                          onChange={(e) => {
                            setData({
                              ...data,
                              stepperAndBaseCodes: {
                                ...data.stepperAndBaseCodes,
                                um: data.stepperAndBaseCodes.um.map((c) =>
                                  c.id === code.id ? { ...c, mov: Number(e.target.value) } : c
                                ),
                              },
                            });
                          }}
                          className="h-6 w-10 text-[10px] text-center font-medium bg-background border border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground rounded px-0.5"
                          autoComplete="off"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">rs</span>
                      </div>
                    </>
                  )}
                  <Badge
                    variant={code.status === "Picked" ? "default" : "outline"}
                    className="text-[9px] h-4 px-2 bg-primary hover:bg-primary border-none text-primary-foreground font-semibold"
                  >
                    {code.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Activate Button */}
          <Button
            type="button"
            className="w-full mt-3 text-xs h-9 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all"
            disabled={updateSelectedCodes.isPending}
            onClick={() => {
              // Extract selected code IDs for each segment
              const selectedCodes = {
                la: data.stepperAndBaseCodes.la.filter((c) => c.selected).map((c) => c.id),
                mm: data.stepperAndBaseCodes.mm.filter((c) => c.selected).map((c) => c.id),
                um: data.stepperAndBaseCodes.um.filter((c) => c.selected).map((c) => c.id),
                flash_sale: [], // TODO: Add flash sale codes when available
                bogo: [], // TODO: Add BOGO codes when available
              };

              // Save to database
              updateSelectedCodes.mutate(
                { resId, selectedCodes },
                {
                  onSuccess: () => {
                    const totalSelected =
                      selectedCodes.la.length + selectedCodes.mm.length + selectedCodes.um.length;
                    toast({
                      title: "Codes Saved",
                      description: `${totalSelected} codes saved successfully`,
                    });
                  },
                  onError: (error) => {
                    toast({
                      title: "Error",
                      description: `Failed to save codes: ${error.message}`,
                      variant: "destructive",
                    });
                  },
                }
              );
            }}
          >
            {updateSelectedCodes.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Activate Selected Codes"
            )}
          </Button>
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
