"use client"

import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command"
import {FormControl,} from "@/components/ui/form"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Key, useMemo, useState} from "react";
import {useTranslation} from "@/app/i18n/client";

export interface ComboBoxItem {
  label: string;
  value: string;
}

export interface ComboBoxGroup {
  label?: string;
  key: Key;
  children: ComboBoxItem[];
}

export interface ComboBoxProps {
  options: ComboBoxGroup[];
  value?: string;
  onChange?: (v: string) => void;
  searchPlaceholder?: string;
  noResultText?: string;
  className?: string;
  disabled?: boolean
}

export function ComboBox({
                           options,
                           value,
                           onChange,
                           searchPlaceholder,
                           noResultText,
                           className,
                           disabled
                         }: ComboBoxProps) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false)

  const currentItem = useMemo(() => (
    options.flatMap(group => group.children).find(o => o.value === value)
  ), [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            disabled={disabled}
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !value && "text-muted-foreground",
              className
            )}
          >
            {currentItem ? currentItem.label : "Select language"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder ?? t("comboBox.defaultSearchPlaceholder")}
            className="h-9"
          />
          <CommandEmpty>{noResultText ?? t("comboBox.defaultNoResultText")}</CommandEmpty>
          {
            options.map(group => (
              <CommandGroup heading={group.label} key={group.key}>
                {group.children.map(item => (
                  <CommandItem value={item.value} key={item.value} onSelect={() => {
                    onChange?.(item.value)
                    setOpen(false);
                  }}>
                    {item.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        item.value === currentItem?.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          }
        </Command>
      </PopoverContent>
    </Popover>
  )
}
