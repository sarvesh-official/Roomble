import * as React from "react";
import { Check, ChevronsUpDown, X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface TagOption {
  label: string;
  value: string;
  isCategory?: boolean;
}

interface TagInputProps {
  options: TagOption[];
  selectedValues: string[];
  customTags: string[];
  onTagSelect: (value: string) => void;
  onTagRemove: (value: string) => void;
  onCustomTagAdd: (tag: string) => void;
  onCustomTagRemove: (tag: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function TagInput({
  options,
  selectedValues,
  customTags,
  onTagSelect,
  onTagRemove,
  onCustomTagAdd,
  onCustomTagRemove,
  placeholder = "Search or add tags...",
  emptyMessage = "No tags found. Type to create a custom tag.",
  className,
  disabled = false,
}: TagInputProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState<TagOption[]>([]);

  // Filter options based on input value and selected values
  React.useEffect(() => {
    const filtered = options.filter(option => {
      // Don't show already selected options
      if (selectedValues.includes(option.value)) return false;
      
      // If there's input, filter by it
      if (inputValue.trim()) {
        return option.label.toLowerCase().includes(inputValue.toLowerCase());
      }
      
      // Otherwise show all unselected options
      return true;
    });
    
    setFilteredOptions(filtered);
  }, [options, selectedValues, inputValue]);

  // Handle tag selection
  const handleTagSelect = React.useCallback((value: string) => {
    onTagSelect(value);
    setInputValue("");
    setOpen(false);
  }, [onTagSelect]);

  // Handle custom tag creation
  const handleCreateCustomTag = React.useCallback(() => {
    if (inputValue.trim()) {
      onCustomTagAdd(inputValue.trim());
      setInputValue("");
      setOpen(false);
    }
  }, [inputValue, onCustomTagAdd]);

  // Handle key press events
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      
      // Check if the tag already exists as an option
      const existingOption = options.find(option => 
        option.label.toLowerCase() === inputValue.trim().toLowerCase()
      );
      
      if (existingOption) {
        // If it exists and isn't already selected, select it
        if (!selectedValues.includes(existingOption.value)) {
          onTagSelect(existingOption.value);
        }
      } else {
        // Otherwise create a custom tag
        onCustomTagAdd(inputValue.trim());
      }
      
      setInputValue("");
      setOpen(false);
    }
  }, [inputValue, options, selectedValues, onTagSelect, onCustomTagAdd]);

  // Render selected tags as badges
  const renderSelectedTags = () => (
    <div className="flex flex-wrap gap-2 mb-2">
      {selectedValues.map((value) => {
        const option = options.find((o) => o.value === value);
        if (!option) return null;
        return (
          <Badge
            key={option.value}
            variant={option.isCategory ? "category" : "default"}
            className="flex items-center gap-1 py-1"
          >
            {option.label}
            <X
              size={14}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onTagRemove(option.value);
              }}
            />
          </Badge>
        );
      })}
      {customTags.map((tag) => (
        <Badge
          key={tag}
          variant="custom"
          className="flex items-center gap-1 py-1"
        >
          {tag}
          <X
            size={14}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onCustomTagRemove(tag);
            }}
          />
        </Badge>
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      {(selectedValues.length > 0 || customTags.length > 0) && renderSelectedTags()}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            disabled={disabled}
          >
            {placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false} onKeyDown={handleKeyDown}>
            <CommandInput 
              placeholder={placeholder} 
              value={inputValue}
              onValueChange={setInputValue}
              autoComplete="off"
            />
            <CommandList>
              {/* Show create option if input doesn't match existing tag */}
              {inputValue.trim() && !options.some(option => 
                option.label.toLowerCase() === inputValue.trim().toLowerCase()) && (
                <CommandItem
                  value={`create-${inputValue}`}
                  className="flex items-center gap-2 text-muted-foreground"
                  onSelect={() => handleCreateCustomTag()}
                >
                  <Plus size={16} />
                  Add "{inputValue}" as custom tag
                </CommandItem>
              )}
              
              {/* Empty state */}
              {filteredOptions.length === 0 && !inputValue.trim() && (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              )}
              
              {/* Tag options */}
              <CommandGroup className="max-h-64 overflow-auto">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleTagSelect(option.value)}
                    className="flex items-center cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className={option.isCategory ? "font-medium" : ""}>
                      {option.label}
                    </span>
                    {option.isCategory && (
                      <span className="ml-2 rounded-md bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">
                        Category
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
