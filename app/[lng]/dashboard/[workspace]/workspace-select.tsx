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
import {usePathname, useRouter} from "next/navigation";
import {WorkspaceModel} from "@/request/workspace";
import AddWorkspaceDialog from "@/components/dialog/workspace/add-dialog";
import ManageWorkspaceDialog from "@/components/dialog/workspace/manage-dialog";

export interface WorkspaceSelectProps {
  value: string;
  workspaces: WorkspaceModel[];
}

export function WorkspaceSelect({value, workspaces}: WorkspaceSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false)
  const [filterText, setFilterText] = useState("");
  const {t} = useTranslation();

  const current = useMemo(
    () => workspaces.find(w => w.id + "" === value), [value, workspaces]);
  const filteredWorkspaces = useMemo(
    () => workspaces.filter(w => w.label.toLowerCase().indexOf(filterText.toLowerCase()) !== -1),
    [filterText, workspaces]
  );

  const popOver = (setAddWorkspaceOpen: (v: boolean) => void, setManageWorkspaceOpen: (v: boolean) => void) => (
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
          {current
            ? <div className={"flex items-center overflow-hidden"}>
              <div className={"rounded-full w-4 h-4 mr-2 flex-none"} style={{backgroundColor: current.color}}></div>
              <div className={"flex-auto"}>{current.label}</div>
            </div>
            : t("sidebar.workspaceSelect.placeholder")}
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput value={filterText} onValueChange={setFilterText}
                        placeholder={t("sidebar.workspaceSelect.placeholder")}/>
          <CommandGroup>
            {filteredWorkspaces.length === 0 &&
                <div className={"py-6 text-center text-sm"}>{t("sidebar.workspaceSelect.notFound")}</div>}
            {filteredWorkspaces.map((workspace) => (
              <CommandItem
                key={workspace.id}
                value={workspace.id + ""}
                onSelect={(currentValue) => {
                  setOpen(false)
                  const strings = pathname.split('/');
                  strings[3] = currentValue;
                  router.push(strings.join('/'));
                }}
                className={"flex justify-between items-center overflow-hidden"}
              >
                <div className={"flex items-center flex-auto overflow-hidden"}>
                  <div className={"rounded-full w-4 h-4 mr-2 flex-none"}
                       style={{backgroundColor: workspace.color}}></div>
                  <div className={"flex-auto"}>{workspace.label}</div>
                </div>
                <LuCheck
                  className={cn(
                    "mx-2 h-4 w-4 flex-none",
                    value === workspace.id + "" ? "" : "hidden"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator alwaysRender={true}/>
          <CommandGroup>
            <CommandItem onSelect={() => {
              setOpen(false);
              setAddWorkspaceOpen(true);
            }}>
              <LuPlus className={"w-4 h-4 mr-2"}/>
              {t("sidebar.workspaceSelect.createButton")}
            </CommandItem>
            <CommandItem onSelect={() => {
              setOpen(false);
              setManageWorkspaceOpen(true);
            }}>
              <TbNut className={"w-4 h-4 mr-2"}/>
              {t("sidebar.workspaceSelect.manageButton")}
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )

  return (
    <AddWorkspaceDialog>
      {setAddWorkspaceOpen => (
        <ManageWorkspaceDialog workspaces={workspaces}>
          {setManageWorkspaceOpen => popOver(setAddWorkspaceOpen, setManageWorkspaceOpen)}
        </ManageWorkspaceDialog>
      )}
    </AddWorkspaceDialog>
  )
}
