import { ManagementCard } from "@/components/temp/ui/ManagementCard";
import { ItemsData } from "@/types/restaurantTemp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleButtonGroup } from "@/components/temp/ui/ToggleButtonGroup";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useUpdateItemsApproached,
  useUpdateItemsConverted,
  useUpdateItemsAdded,
} from "@/hooks/useDriveSheetMutations";
import { useToast } from "@/hooks/use-toast";

interface ItemsManagementCardProps {
  data: ItemsData;
  resId: string;
}

export const ItemsManagementCard = ({ data: initialData, resId }: ItemsManagementCardProps) => {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();

  // Sync local state with prop changes (e.g., after refetch on sign in)
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Mutation hooks
  const updateApproached = useUpdateItemsApproached();
  const updateConverted = useUpdateItemsConverted();
  const updateItemsAdded = useUpdateItemsAdded();

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
            description: "Items approached status updated",
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
            description: "Items converted status updated",
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

  const handleItemAddedChange = (id: string, value: string) => {
    setData({
      ...data,
      itemsAdded: data.itemsAdded.map((item) => (item.id === id ? { ...item, value } : item)),
    });
  };

  const handleItemPriceChange = (id: string, price: string) => {
    setData({
      ...data,
      itemsAdded: data.itemsAdded.map((item) => (item.id === id ? { ...item, price } : item)),
    });
  };

  const handleItemCheckedChange = (id: string) => {
    setData({
      ...data,
      itemsAdded: data.itemsAdded.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    });
  };

  return (
    <ManagementCard title="Items <= 159" subtitle="Add Items under 159rs">
      {/* 3 Info Boxes */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 text-center hover:shadow-sm transition-all">
          <div className="text-xs text-red-600 dark:text-red-400 mb-1 font-medium">Priority</div>
          <div className="text-sm font-bold text-foreground">{data.priority}</div>
        </div>
        <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/10 text-center hover:shadow-sm transition-all">
          <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-1 font-medium">
            POS Flag
          </div>
          <div className="text-sm font-bold text-foreground">{data.posFlag}</div>
        </div>
        <div className="p-3 border border-border rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 text-center hover:shadow-sm transition-all">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1 font-medium">
            PG 7-10
          </div>
          <div className="text-sm font-bold text-foreground">{data.pg7to10}</div>
        </div>
      </div>

      {/* Dish Suggestions */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Dish Suggestions</h4>
        <div className="grid grid-cols-2 gap-2">
          {data.dishSuggestions.map((dish, index) => (
            <div
              key={index}
              className="p-3 border border-border rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 text-center hover:shadow-sm hover:border-primary/30 transition-all"
            >
              <span className="text-xs font-medium text-foreground">
                {index + 1}. {dish}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Approached & Converted */}
      <div className="space-y-3">
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

      {/* Items Added */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Items Added</h4>
        <div className="space-y-2">
          {data.itemsAdded.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-4">{index + 1}.</span>
              <Input
                type="text"
                value={item.value}
                onChange={(e) => handleItemAddedChange(item.id, e.target.value)}
                placeholder="Item name"
                className="flex-1 h-8 text-sm"
                autoComplete="off"
              />
              <Input
                type="text"
                value={item.price}
                onChange={(e) => handleItemPriceChange(item.id, e.target.value)}
                placeholder="Price"
                className="w-20 h-8 text-sm"
                autoComplete="off"
              />
              <Checkbox
                id={`item-${item.id}`}
                checked={item.checked}
                onCheckedChange={() => handleItemCheckedChange(item.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="button"
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all"
        disabled={updateItemsAdded.isPending}
        onClick={() => {
          // Convert items to the format expected by the database
          const items = data.itemsAdded.map((item) => ({
            id: item.id,
            name: item.value,
            price: item.price,
            checked: item.checked,
          }));

          // Save to database
          updateItemsAdded.mutate(
            { resId, items },
            {
              onSuccess: () => {
                const addedItems = items.filter((item) => item.checked && item.name);
                toast({
                  title: "Items Saved",
                  description: `${addedItems.length} items saved successfully`,
                });
              },
              onError: (error) => {
                toast({
                  title: "Error",
                  description: `Failed to save items: ${error.message}`,
                  variant: "destructive",
                });
              },
            }
          );
        }}
      >
        {updateItemsAdded.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Submit Items"
        )}
      </Button>
    </ManagementCard>
  );
};
