import React from "react";
import {Sidebar, SidebarSection} from "@/components/ui/sidebar";
import {BiHome, BiMoviePlay, BiTrash} from "react-icons/bi";
import {SidebarClientItem, SidebarLogOutItem, SidebarSettingsItem} from "@/components/ui/sidebar-client-item";
import {cn} from "@/lib/utils";
import ToggleSidebarButton, {isSidebarOpen} from "@/app/[lng]/dashboard/[workspace]/toggle-sidebar-button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {LuPanelLeftOpen} from "react-icons/lu";
import {Button} from "@/components/ui/button";
import {useTranslation} from "@/app/i18n";
import {WorkspaceSelect} from "@/app/[lng]/dashboard/[workspace]/workspace-select";
import {getWorkspaceListApi} from "@/request/workspace";
import {WorkspaceProvider} from "@/components/provider/workspace-provider";
import {SettingsDialogProvider} from "@/components/provider/settings-dialog-provider";

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

  const {data: workspaces} = await getWorkspaceListApi();

  const sidebarContent = (
    <>
      <SidebarSection>
        <WorkspaceSelect value={workspace} workspaces={workspaces}/>
      </SidebarSection>
      <SidebarSection>
        <SidebarClientItem href={`/${lng}/dashboard/${workspace}/home`} icon={<BiHome className={"w-4 h-4 mr-2"}/>}>
          {t("sidebar.home")}
        </SidebarClientItem>
        <SidebarClientItem href={`/${lng}/dashboard/${workspace}/media`}
                           icon={<BiMoviePlay className={"w-4 h-4 mr-2"}/>}>
          {t("sidebar.media")}
        </SidebarClientItem>
        <SidebarClientItem href={`/${lng}/dashboard/${workspace}/trash`} icon={<BiTrash className={"w-4 h-4 mr-2"}/>}>
          {t("sidebar.trash")}
        </SidebarClientItem>
        <SidebarSettingsItem>
          {t("sidebar.settings")}
        </SidebarSettingsItem>
        <SidebarLogOutItem/>
      </SidebarSection>
    </>
  )

  return (
    <SettingsDialogProvider>
      <WorkspaceProvider list={workspaces} id={workspace}>
        <div className={"h-screen flex"}>
          <Sidebar className={cn("hidden", sidebarOpen && "lg:border-r lg:block lg:w-64 flex-none")} header={
            <div className={"text-right"}>
              <ToggleSidebarButton/>
            </div>
          }>
            {sidebarContent}
          </Sidebar>

          <div className={cn("my-4 flex-none absolute left-3", sidebarOpen && "lg:my-2")}>
            {!sidebarOpen && <ToggleSidebarButton className={"hidden lg:inline-flex"}/>}
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
          <div className={cn("flex-auto px-3 flex flex-col pt-4")}>
            {children}
          </div>
        </div>
      </WorkspaceProvider>
    </SettingsDialogProvider>
  )
}