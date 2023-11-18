"use client"

import * as React from "react"
import {useMemo, useState} from "react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandGroup, CommandInput, CommandItem, CommandSeparator,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {LuCheck, LuChevronsUpDown, LuPlus} from "react-icons/lu";
import {useTranslation} from "@/app/i18n/client";
import {TbNut} from "react-icons/tb";

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
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [filterText, setFilterText] = useState("");
  const {t} = useTranslation();

  const current = useMemo(
    () => workspaces.find(w => w.value === value), [value]);
  const filteredWorkspaces = useMemo(
    () => workspaces.filter(w => w.label.toLowerCase().indexOf(filterText.toLowerCase()) !== -1),
    [filterText]
  );

  return (
    <Popover open={open} onOpenChange={(open) => {
      setOpen(open);
      if (open)
        setFilterText("");
    }}>
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
        <Command shouldFilter={false}>
          <CommandInput value={filterText} onValueChange={setFilterText} placeholder="Search framework..."/>
          <CommandGroup>
            {filteredWorkspaces.length === 0 &&
                <div className={"py-6 text-center text-sm"}>{t("sidebar.workspaceSelect.notFound")}</div>}
            {filteredWorkspaces.map((workspace) => (
              <CommandItem
                key={workspace.value}
                value={workspace.value}
                onSelect={(currentValue) => {
                  setValue(currentValue)
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
          <CommandSeparator alwaysRender={true}/>
          <CommandGroup>
            <CommandItem>
              <LuPlus className={"w-4 h-4 mr-2"}/>
              {t("sidebar.workspaceSelect.createButton")}
            </CommandItem>
            <CommandItem>
              <TbNut className={"w-4 h-4 mr-2"}/>
              {t("sidebar.workspaceSelect.manageButton")}
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
