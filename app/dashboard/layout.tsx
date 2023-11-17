import React from "react";
import {Sidebar, SidebarSection} from "@/components/ui/sidebar";
import {BiHome, BiMoviePlay, BiTrash} from "react-icons/bi";
import {FiSettings} from "react-icons/fi";
import {SidebarLinkItem} from "@/components/ui/sidebar-link-item";
import {cn} from "@/lib/utils";
import ToggleSidebarButton, {isSidebarOpen} from "@/components/ui/toggle-sidebar-button";

export default function DashboardLayout(
  {children}: { children: React.ReactNode }
) {
  const sidebarOpen = isSidebarOpen();

  return (
    <div className={"h-screen flex"}>
      <Sidebar className={cn("hidden", sidebarOpen && "lg:border-r lg:block lg:w-64")} header={
        <div className={"text-right"}>
          <ToggleSidebarButton/>
        </div>
      }>
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
          <SidebarLinkItem href={"/dashboard/settings"} icon={<FiSettings className={"w-4 h-4 mr-2"}/>}>
            Settings
          </SidebarLinkItem>
        </SidebarSection>
      </Sidebar>
      <div className={"flex-auto px-3"}>
        <div className={cn("my-4 invisible", !sidebarOpen && "lg:visible")}>
          <ToggleSidebarButton/>
        </div>
        {children}
      </div>
    </div>
  )
}