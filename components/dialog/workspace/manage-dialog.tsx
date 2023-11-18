import React, {useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {useTranslation} from "@/app/i18n/client";
import {WorkspaceModel} from "@/request/workspace";

export interface AddWorkspaceDialogProps {
  children: (setOpen: (v: boolean) => void) => React.ReactNode,
  list: WorkspaceModel[]
}

export default function ManageWorkspaceDialog({children, list}: AddWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();

  return (
    <>
      {children((v) => {
        setOpen(v);
      })}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("sidebar.workspaceManagement.title")}</DialogTitle>
            <DialogDescription>
              {t("sidebar.workspaceManagement.description")}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}