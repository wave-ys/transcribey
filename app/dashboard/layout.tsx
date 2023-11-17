import React, {useMemo} from "react";
import {Sidebar, SidebarItem, SidebarSection} from "@/components/ui/sidebar";
import {BiHome, BiMoviePlay, BiTrash} from "react-icons/bi";
import {FiSettings} from "react-icons/fi";
import {SidebarLinkItem} from "@/components/ui/sidebar-link-item";
import {cn} from "@/lib/utils";
import ToggleSidebarButton, {isSidebarOpen} from "@/components/ui/toggle-sidebar-button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {LuPanelLeftOpen} from "react-icons/lu";
import {Button} from "@/components/ui/button";
import SettingsDialog from "@/components/dialog/settings";

export default function DashboardLayout(
  {children}: { children: React.ReactNode }
) {
  const sidebarOpen = isSidebarOpen();

  const sidebarContent = useMemo(() => (
    <SidebarSection>
      <SidebarLinkItem href={"/dashboard/home"} icon={<BiHome className={"w-4 h-4 mr-2"}/>}>
        Home
      </SidebarLinkItem>
      <SidebarLinkItem href={"/dashboard/media"} icon={<BiMoviePlay className={"w-4 h-4 mr-2"}/>}>
        Media
      </SidebarLinkItem>
      <SidebarLinkItem href={"/dashboard/trash"} icon={<BiTrash className={"w-4 h-4 mr-2"}/>}>
        Trash
      </SidebarLinkItem>
      <SettingsDialog>
        <SidebarItem icon={<FiSettings className={"w-4 h-4 mr-2"}/>}>
          Settings
        </SidebarItem>
      </SettingsDialog>
    </SidebarSection>
  ), [])

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