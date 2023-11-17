"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import React, {useMemo, useState} from "react";
import {Sidebar, SidebarItem, SidebarSection} from "@/components/ui/sidebar";
import {FiFolder, FiSettings} from "react-icons/fi";
import {GeneralSettings} from "@/components/dialog/settings/general";
import {ModelsSettings} from "@/components/dialog/settings/models";

interface SettingsPageItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  page: React.ReactNode;
}

const settingPages: SettingsPageItem[] = [
  {
    key: 'general',
    title: 'General',
    icon: <FiSettings className={"w-4 h-4 sm:mr-2"}/>,
    page: <GeneralSettings/>
  },
  {
    key: 'models',
    title: 'General',
    icon: <FiFolder className={"w-4 h-4 sm:mr-2"}/>,
    page: <ModelsSettings/>
  }
]

export default function SettingsDialog({children}: React.HTMLAttributes<HTMLDivElement>) {
  const [currentPage, setCurrentPage] = useState<string>("general");
  const currentPageComponent = useMemo(() => (
    settingPages.find(page => page.key === currentPage)?.page
  ), [currentPage])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={"max-w-4xl"}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className={"grid grid-cols-4 h-[32rem]"}>
          <Sidebar className={"border-r pl-0 pr-4 col-span-1 pt-4"}>
            <SidebarSection>
              {
                settingPages.map(page =>
                  <SidebarItem key={page.key} icon={page.icon} enableSmall
                               active={page.key === currentPage}
                               onClick={() => setCurrentPage(page.key)}>
                    {page.title}
                  </SidebarItem>)
              }
            </SidebarSection>
          </Sidebar>
          <div className={"col-span-3 pl-4"}>
            {currentPageComponent}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}