"use client";

import * as React from "react";
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
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Currencies, Currency } from "@/lib/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { UserSettings } from "@prisma/client";
import { useEffect, useState } from "react";
import UpdateUserCurrency from "@/app/wizard/_actions/userSettings";
import { toast } from "sonner";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setselectedOption] = useState<Currency | null>(null);

  const getUserSettings = async () => {
    const res = await fetch("/api/user-settings");
    const data = await res.json();
    return data;
  };

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: getUserSettings,
  });

  const { isFetching } = userSettings;

  useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );
    if (userCurrency) setselectedOption(userCurrency);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationKey: ["updateUserCurrency"],
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success("Currency updated successfully", {
        id: "update-currency",
      });
      setselectedOption(
        Currencies.find((v) => v.value === data.currency) || null
      );
    },
    onError: () => {
      toast.error("Something went wrong.", {
        id: "update-currency",
      });
    },
  });

  const selectOption = (currency: Currency | null) => {
    if (!currency) {
      toast.error("Please select a currency");
      return;
    }
    toast.loading("Updating currency", {
      id: "update-currency",
    });
    mutation.mutate(currency.value);
  };

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start w-full"
              disabled={mutation.isPending}
            >
              {selectedOption ? (
                <>{selectedOption.label}</>
              ) : (
                <>Select Currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <OptionsList setOpen={setOpen} setselectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="justify-start w-full"
            disabled={mutation.isPending}
          >
            {selectedOption ? (
              <>{selectedOption.label}</>
            ) : (
              <>Select Currency</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="hidden">Mobile Drawer</DrawerTitle>
          <div className="mt-4 border-t">
            <OptionsList setOpen={setOpen} setselectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionsList({
  setOpen,
  setselectedOption,
}: {
  setOpen: (open: boolean) => void;
  setselectedOption: (currency: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.id}
              value={currency.value}
              onSelect={(value) => {
                setselectedOption(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
