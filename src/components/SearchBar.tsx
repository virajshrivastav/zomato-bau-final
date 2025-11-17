import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({
  placeholder = "Search restaurants...",
  className,
  value,
  onChange,
}: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        className={`pl-8 sm:pl-10 text-xs sm:text-sm ${className}`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
