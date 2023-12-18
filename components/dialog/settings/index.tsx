"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import React, {useMemo, useState} from "react";
import {Sidebar, SidebarItem, SidebarSection} from "@/components/ui/sidebar";
import {FiSettings} from "react-icons/fi";
import {GeneralSettings} from "@/components/dialog/settings/general";
import {useTranslation} from "@/app/i18n/client";
import {useSettingsDialog} from "@/components/provider/settings-dialog-provider";

interface SettingsPageItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  page: React.ReactNode;
}

export default function SettingsDialog() {
  const {t} = useTranslation();
  const dialogState = useSettingsDialog();
  const [currentPage, setCurrentPage] = useState<string>("general");

  const settingPages: SettingsPageItem[] = useMemo(() => [
    {
      key: 'general',
      title: t("settings.sidebar.general"),
      icon: <FiSettings className={"w-4 h-4 sm:mr-2"}/>,
      page: <GeneralSettings/>
    }
  ], [t])

  const currentPageComponent = useMemo(() => (
    settingPages.find(page => page.key === currentPage)?.page
  ), [currentPage, settingPages])

  return (
    <Dialog open={dialogState.open} onOpenChange={open => dialogState.setState({open})}>
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