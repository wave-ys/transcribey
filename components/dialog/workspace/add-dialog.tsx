import React, {useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {useTranslation} from "@/app/i18n/client";

export interface AddWorkspaceDialogProps {
  children: (setOpen: (v: boolean) => void) => React.ReactNode
}

export default function AddWorkspaceDialog({children}: AddWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();
  return (
    <>
      {children(setOpen)}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("sidebar.createWorkspace.title")}</DialogTitle>
            <DialogDescription>
              {t("sidebar.createWorkspace.description")}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}