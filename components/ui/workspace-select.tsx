"use client"

import * as React from "react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {LuCheck, LuChevronsUpDown} from "react-icons/lu";
import {useTranslation} from "@/app/i18n/client";

const workspaces = [
  {
    value: "next.js",
    label: "Next.js",
    color: "#FF0000"
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    color: "#00FFFF"
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    color: "#0000FF"
  },
  {
    value: "remix",
    label: "Remix",
    color: "#FFFF00"
  },
  {
    value: "astro",
    label: "Astro",
    color: "#009000"
  },
]

export function WorkspaceSelect() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const {t} = useTranslation();

  const current = workspaces.find(w => w.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? <div className={"flex items-center"}>
              <div className={"rounded-full w-4 h-4 mr-2"} style={{backgroundColor: current?.color}}></div>
              <span>{current?.label}</span>
            </div>
            : t("sidebar.workspaceSelect.placeholder")}
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..."/>
          <CommandEmpty>{t("sidebar.workspaceSelect.notFound")}</CommandEmpty>
          <CommandGroup>
            {workspaces.map((workspace) => (
              <CommandItem
                key={workspace.value}
                value={workspace.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
                className={"flex justify-between items-center"}
              >
                <div className={"flex items-center"}>
                  <div className={"rounded-full w-4 h-4 mr-2"} style={{backgroundColor: workspace.color}}></div>
                  <div>{workspace.label}</div>
                </div>
                <LuCheck
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === workspace.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
