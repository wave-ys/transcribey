import React from "react";
import {Sidebar, SidebarSection} from "@/components/ui/sidebar";
import {BiHome, BiMoviePlay, BiTrash} from "react-icons/bi";
import {FiSettings} from "react-icons/fi";
import {SidebarLinkItem} from "@/components/ui/sidebar-link-item";
import {Button} from "@/components/ui/button";
import {LuPanelLeftClose} from "react-icons/lu";

export default function DashboardLayout(
  {children}: { children: React.ReactNode }
) {
  return (
    <div className={"grid lg:grid-cols-5 h-screen"}>
      <Sidebar className={"hidden lg:block"} header={
        <div className={"text-right"}>
          <Button variant={"ghost"} size={"icon"}><LuPanelLeftClose className={"w-4 h-4"}/></Button>
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
      <div className={"col-span-3 lg:col-span-4 lg:border-l"}>
        {children}
      </div>
    </div>
  )
}