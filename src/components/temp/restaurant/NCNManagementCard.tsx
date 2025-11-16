import { ManagementCard } from "@/components/temp/ui/ManagementCard";
import { ToggleButtonGroup } from "@/components/temp/ui/ToggleButtonGroup";
import { NCNData } from "@/types/restaurantTemp";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
        <div className="mt-4 p-4 bg-muted/20 rounded-lg border border-border/50">
          <h5 className="text-sm font-semibold mb-3 text-foreground">Stepper & Base Codes</h5>

          {/* LA / MM / UM Headers */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center text-xs font-bold text-foreground bg-gradient-to-br from-primary/20 to-primary/10 p-2 rounded-md border border-primary/20">
              LA
            </div>
            <div className="text-center text-xs font-bold text-foreground bg-gradient-to-br from-primary/20 to-primary/10 p-2 rounded-md border border-primary/20">
              MM
            </div>
            <div className="text-center text-xs font-bold text-foreground bg-gradient-to-br from-primary/20 to-primary/10 p-2 rounded-md border border-primary/20">
              UM
            </div>
          </div>

          {/* Codes for each segment */}
          <div className="grid grid-cols-3 gap-2">
            {/* LA Codes */}
            <div className="space-y-2">
              {data.stepperAndBaseCodes.la.map((code) => (
                <div key={code.id} className="p-2 border border-border rounded bg-card text-xs">
                  <div className="flex items-start gap-1 mb-1">
                    <Checkbox
                      id={`la-${code.id}`}
                      checked={code.selected}
                      onCheckedChange={() => {
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
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      {/* Percentage-based code (base code) */}
                      {code.percentage !== undefined ? (
                        <>
                          {/* Display formatted base code prominently */}
                          <div className="mb-2 p-1.5 bg-primary/10 rounded border border-primary/20">
                            <span className="text-xs font-bold text-primary">
                              {code.percentage}% upto {code.maxAmount}rs
                            </span>
                          </div>
                          {/* Editable inputs */}
                          <div className="flex items-center gap-1">
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
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">%</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px]">upto</span>
                            <Input
                              type="number"
                              value={code.maxAmount}
                              onChange={(e) => {
                                setData({
                                  ...data,
                                  stepperAndBaseCodes: {
                                    ...data.stepperAndBaseCodes,
                                    la: data.stepperAndBaseCodes.la.map((c) =>
                                      c.id === code.id
                                        ? { ...c, maxAmount: Number(e.target.value) }
                                        : c
                                    ),
                                  },
                                });
                              }}
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">rs</span>
                          </div>
                        </>
                      ) : (
                        /* Flat discount code (stepper code) */
                        <>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px]">Flat</span>
                            <Input
                              type="number"
                              value={code.flatOff}
                              onChange={(e) => {
                                setData({
                                  ...data,
                                  stepperAndBaseCodes: {
                                    ...data.stepperAndBaseCodes,
                                    la: data.stepperAndBaseCodes.la.map((c) =>
                                      c.id === code.id
                                        ? { ...c, flatOff: Number(e.target.value) }
                                        : c
                                    ),
                                  },
                                });
                              }}
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">rs</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px]">MOV</span>
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
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">rs</span>
                          </div>
                        </>
                      )}
                      <Badge
                        variant={code.status === "Picked" ? "default" : "outline"}
                        className="text-[9px] h-4 px-1 mt-1"
                      >
                        {code.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* MM Codes */}
            <div className="space-y-2">
              {data.stepperAndBaseCodes.mm.map((code) => (
                <div key={code.id} className="p-2 border border-border rounded bg-card text-xs">
                  <div className="flex items-start gap-1 mb-1">
                    <Checkbox
                      id={`mm-${code.id}`}
                      checked={code.selected}
                      onCheckedChange={() => {
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
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      {/* Percentage-based code (base code) */}
                      {code.percentage !== undefined ? (
                        <>
                          {/* Display formatted base code prominently */}
                          <div className="mb-2 p-1.5 bg-primary/10 rounded border border-primary/20">
                            <span className="text-xs font-bold text-primary">
                              {code.percentage}% upto {code.maxAmount}rs
                            </span>
                          </div>
                          {/* Editable inputs */}
                          <div className="flex items-center gap-1">
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
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">%</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px]">upto</span>
                            <Input
                              type="number"
                              value={code.maxAmount}
                              onChange={(e) => {
                                setData({
                                  ...data,
                                  stepperAndBaseCodes: {
                                    ...data.stepperAndBaseCodes,
                                    mm: data.stepperAndBaseCodes.mm.map((c) =>
                                      c.id === code.id
                                        ? { ...c, maxAmount: Number(e.target.value) }
                                        : c
                                    ),
                                  },
                                });
                              }}
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">rs</span>
                          </div>
                        </>
                      ) : (
                        /* Flat discount code (stepper code) */
                        <>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px]">Flat</span>
                            <Input
                              type="number"
                              value={code.flatOff}
                              onChange={(e) => {
                                setData({
                                  ...data,
                                  stepperAndBaseCodes: {
                                    ...data.stepperAndBaseCodes,
                                    mm: data.stepperAndBaseCodes.mm.map((c) =>
                                      c.id === code.id
                                        ? { ...c, flatOff: Number(e.target.value) }
                                        : c
                                    ),
                                  },
                                });
                              }}
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">rs</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px]">MOV</span>
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
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">rs</span>
                          </div>
                        </>
                      )}
                      <Badge
                        variant={code.status === "Picked" ? "default" : "outline"}
                        className="text-[9px] h-4 px-1 mt-1"
                      >
                        {code.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* UM Codes */}
            <div className="space-y-2">
              {data.stepperAndBaseCodes.um.map((code) => (
                <div key={code.id} className="p-2 border border-border rounded bg-card text-xs">
                  <div className="flex items-start gap-1 mb-1">
                    <Checkbox
                      id={`um-${code.id}`}
                      checked={code.selected}
                      onCheckedChange={() => {
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
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      {/* Percentage-based code (base code) */}
                      {code.percentage !== undefined ? (
                        <>
                          {/* Display formatted base code prominently */}
                          <div className="mb-2 p-1.5 bg-primary/10 rounded border border-primary/20">
                            <span className="text-xs font-bold text-primary">
                              {code.percentage}% upto {code.maxAmount}rs
                            </span>
                          </div>
                          {/* Editable inputs */}
                          <div className="flex items-center gap-1">
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
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">%</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px]">upto</span>
                            <Input
                              type="number"
                              value={code.maxAmount}
                              onChange={(e) => {
                                setData({
                                  ...data,
                                  stepperAndBaseCodes: {
                                    ...data.stepperAndBaseCodes,
                                    um: data.stepperAndBaseCodes.um.map((c) =>
                                      c.id === code.id
                                        ? { ...c, maxAmount: Number(e.target.value) }
                                        : c
                                    ),
                                  },
                                });
                              }}
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">rs</span>
                          </div>
                        </>
                      ) : (
                        /* Flat discount code (stepper code) */
                        <>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px]">Flat</span>
                            <Input
                              type="number"
                              value={code.flatOff}
                              onChange={(e) => {
                                setData({
                                  ...data,
                                  stepperAndBaseCodes: {
                                    ...data.stepperAndBaseCodes,
                                    um: data.stepperAndBaseCodes.um.map((c) =>
                                      c.id === code.id
                                        ? { ...c, flatOff: Number(e.target.value) }
                                        : c
                                    ),
                                  },
                                });
                              }}
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">rs</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px]">MOV</span>
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
                              className="h-5 w-12 text-[10px] px-1"
                              autoComplete="off"
                            />
                            <span className="text-[10px]">rs</span>
                          </div>
                        </>
                      )}
                      <Badge
                        variant={code.status === "Picked" ? "default" : "outline"}
                        className="text-[9px] h-4 px-1 mt-1"
                      >
                        {code.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activate Button */}
          <Button
            type="button"
            className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all"
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
