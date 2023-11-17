"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import React, {useMemo, useState} from "react";
import {Sidebar, SidebarItem, SidebarSection} from "@/components/ui/sidebar";
import {FiFolder, FiSettings} from "react-icons/fi";
import {GeneralSettings} from "@/components/dialog/settings/general";
import {ModelsSettings} from "@/components/dialog/settings/models";
import {useTranslation} from "@/app/i18n/client";

interface SettingsPageItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  page: React.ReactNode;
}

export default function SettingsDialog({children}: React.HTMLAttributes<HTMLDivElement>) {
  const {t} = useTranslation();
  const [currentPage, setCurrentPage] = useState<string>("general");

  const settingPages: SettingsPageItem[] = useMemo(() => [
    {
      key: 'general',
      title: t("settings.sidebar.general"),
      icon: <FiSettings className={"w-4 h-4 sm:mr-2"}/>,
      page: <GeneralSettings/>
    },
    {
      key: 'models',
      title: t("settings.sidebar.models"),
      icon: <FiFolder className={"w-4 h-4 sm:mr-2"}/>,
      page: <ModelsSettings/>
    }
  ], [t])

  const currentPageComponent = useMemo(() => (
    settingPages.find(page => page.key === currentPage)?.page
  ), [currentPage, settingPages])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={"max-w-4xl"}>
        <DialogHeader>
          <DialogTitle>{t("settings.title")}</DialogTitle>
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