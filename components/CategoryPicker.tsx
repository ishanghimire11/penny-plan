import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

interface CategoryPickerProps {
  type: TransactionType;
  onChange: (value: string) => void;
}

const CategoryPicker = ({ type, onChange }: CategoryPickerProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const categoryQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const categories = await fetch(`/api/categories?type=${type}`);
      return categories.json();
    },
  });

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [value, onChange]);

  const selectedCategory = categoryQuery.data?.find(
    (category: Category) => category.name === value
  );

  const successCallBack = (category: Category) => {
    setValue(category.name);
    setOpen((prev) => !prev);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="w-full justify-between"
          variant={"outline"}
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select category"
          )}
          <ChevronsUpDownIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[223px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category" />
          <CreateCategoryDialog type={type} successCallBack={successCallBack} />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoryQuery.data &&
                categoryQuery.data.map((category: Category) => (
                  <CommandItem
                    key={category.name}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <CategoryRow category={category} />
                    {value === category.name && (
                      <CheckIcon className="w-4 h-4 mr-2" />
                    )}
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CategoryRow = ({ category }: { category: Category }) => {
  return (
    <div className="flex items-center gap-x-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
};

export default CategoryPicker;
