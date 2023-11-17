import React from "react";
import {Sidebar, SidebarItem, SidebarSection} from "@/components/ui/sidebar";
import {BiHome, BiMoviePlay, BiTrash} from "react-icons/bi";
import {FiSettings} from "react-icons/fi";
import {SidebarItems, SidebarSettingsItem} from "@/components/ui/sidebar-items";
import {cn} from "@/lib/utils";
import ToggleSidebarButton, {isSidebarOpen} from "@/components/ui/toggle-sidebar-button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {LuPanelLeftOpen} from "react-icons/lu";
import {Button} from "@/components/ui/button";
import {useTranslation} from "@/app/i18n";
import {useSettingsDialog} from "@/components/provider/dialog-provider";

interface DashboardLayoutProps {
  params: {
    lng: string
  },
  children: React.ReactNode
}

export default async function DashboardLayout(
  {children, params: {lng}}: DashboardLayoutProps
) {
  const sidebarOpen = isSidebarOpen();
  const {t} = await useTranslation(lng);

  const sidebarContent = (
    <SidebarSection>
      <SidebarItems href={`/${lng}/dashboard/home`} icon={<BiHome className={"w-4 h-4 mr-2"}/>}>
        {t("sidebar.home")}
      </SidebarItems>
      <SidebarItems href={`/${lng}/dashboard/media`} icon={<BiMoviePlay className={"w-4 h-4 mr-2"}/>}>
        {t("sidebar.media")}
      </SidebarItems>
      <SidebarItems href={`/${lng}/dashboard/trash`} icon={<BiTrash className={"w-4 h-4 mr-2"}/>}>
        {t("sidebar.trash")}
      </SidebarItems>
      <SidebarSettingsItem>
        {t("sidebar.settings")}
      </SidebarSettingsItem>
    </SidebarSection>
  )

  return (
    <div className={"h-screen flex"}>
      <Sidebar className={cn("hidden", sidebarOpen && "lg:border-r lg:block lg:w-64")} header={
        <div className={"text-right"}>
          <ToggleSidebarButton/>
        </div>
      }>
        {sidebarContent}
      </Sidebar>
      <div className={"flex-auto px-3"}>
        <div className={"my-4"}>
          {!sidebarOpen && <ToggleSidebarButton className={"hidden lg:block"}/>}
          <Sheet>
            <SheetTrigger asChild>
              <Button className={"inline-flex lg:hidden"} variant={"ghost"} size={"icon"}>
                <LuPanelLeftOpen className={"w-4 h-4"}/>
              </Button>
            </SheetTrigger>
            <SheetContent side={"left"} className={"p-0"}>
              <Sidebar className={"mt-12"}>
                {sidebarContent}
              </Sidebar>
            </SheetContent>
          </Sheet>
        </div>
        {children}
      </div>
    </div>
  )
}