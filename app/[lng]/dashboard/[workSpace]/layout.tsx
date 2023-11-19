import React from "react";
import {Sidebar, SidebarSection} from "@/components/ui/sidebar";
import {BiHome, BiMoviePlay, BiTrash} from "react-icons/bi";
import {SidebarLinkItem, SidebarSettingsItem} from "@/components/ui/sidebar-link-item";
import {cn} from "@/lib/utils";
import ToggleSidebarButton, {isSidebarOpen} from "@/components/toggle-sidebar-button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {LuPanelLeftOpen} from "react-icons/lu";
import {Button} from "@/components/ui/button";
import {useTranslation} from "@/app/i18n";
import {WorkspaceSelect} from "@/components/workspace-select";
import {getWorkspaceListApi} from "@/request/workspace";
import {serverRequest} from "@/request";

interface DashboardLayoutProps {
  params: {
    lng: string,
    workspace: string
  },
  children: React.ReactNode
}

export default async function DashboardLayout(
  {children, params: {lng, workspace}}: DashboardLayoutProps
) {
  const sidebarOpen = isSidebarOpen();
  const {t} = await useTranslation(lng);

  const {data: workspaces} = await getWorkspaceListApi(serverRequest);

  const sidebarContent = (
    <>
      <SidebarSection>
        <WorkspaceSelect value={workspace} workspaces={workspaces}/>
      </SidebarSection>
      <SidebarSection>
        <SidebarLinkItem href={`/${lng}/dashboard/${workspace}/home`} icon={<BiHome className={"w-4 h-4 mr-2"}/>}>
          {t("sidebar.home")}
        </SidebarLinkItem>
        <SidebarLinkItem href={`/${lng}/dashboard/${workspace}/media`} icon={<BiMoviePlay className={"w-4 h-4 mr-2"}/>}>
          {t("sidebar.media")}
        </SidebarLinkItem>
        <SidebarLinkItem href={`/${lng}/dashboard/${workspace}/trash`} icon={<BiTrash className={"w-4 h-4 mr-2"}/>}>
          {t("sidebar.trash")}
        </SidebarLinkItem>
        <SidebarSettingsItem>
          {t("sidebar.settings")}
        </SidebarSettingsItem>
      </SidebarSection>
    </>
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