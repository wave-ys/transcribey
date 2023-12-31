import React, {useMemo, useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {useTranslation} from "@/app/i18n/client";
import {WorkspaceModel} from "@/request/workspace";
import {Sidebar, SidebarItem, SidebarSection} from "@/components/ui/sidebar";
import {useParams, useRouter} from "next/navigation";
import ManagePage from "@/components/dialog/workspace/manage-page";
import {useAlert} from "@/components/provider/alert-provider";

export interface AddWorkspaceDialogProps {
  children: (setOpen: (v: boolean) => void) => React.ReactNode,
  workspaces: WorkspaceModel[]
}

export default function ManageWorkspaceDialog({children, workspaces}: AddWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();
  const params = useParams();
  const router = useRouter();
  const [currentId, setCurrentId] = useState<string>(params['workspace'] as string);
  const [dirty, setDirty] = useState(false);
  const alert = useAlert();
  const current = useMemo(
    () => workspaces.find(w => w.id + "" === currentId) ?? null,
    [currentId, workspaces]);

  return (
    <>
      {children((v) => {
        setOpen(v);
      })}
      <Dialog open={open} onOpenChange={(v: boolean) => {
        setOpen(v);
        if (!v && !current)
          router.push(`/${params['lng']}/dashboard`);
      }}>
        <DialogContent className={"max-w-3xl"}>
          <DialogHeader>
            <DialogTitle>{t("sidebar.workspaceManagement.title")}</DialogTitle>
            <DialogDescription>
              {t("sidebar.workspaceManagement.description")}
            </DialogDescription>
          </DialogHeader>
          <div className={"grid grid-cols-4 h-[24rem]"}>
            <Sidebar className={"border-r pl-0 pr-4 col-span-1 pt-4 overflow-y-auto"}>
              <SidebarSection>
                {
                  workspaces.map(workspace =>
                    <SidebarItem key={workspace.id} enableSmall
                                 className={"overflow-x-hidden"}
                                 active={workspace.id + "" === currentId}
                                 onClick={async () => {
                                   if (dirty && !await alert({
                                     title: t("sidebar.workspaceManagement.confirmSwitchTitle"),
                                     description: t("sidebar.workspaceManagement.confirmSwitchDescription")
                                   }))
                                     return;
                                   setDirty(false);
                                   setCurrentId(workspace.id + "");
                                 }}>
                      {workspace.label}
                    </SidebarItem>)
                }
              </SidebarSection>
            </Sidebar>
            <div className={"col-span-3 pl-4"}>
              {current && <ManagePage workspace={current} onDirtyChange={setDirty}/>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}