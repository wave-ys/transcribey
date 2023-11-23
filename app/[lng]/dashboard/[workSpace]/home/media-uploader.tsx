'use client';

import React, {useCallback, useRef, useState} from "react";
import TranscribeOptionsDialog from "@/components/dialog/transcribe-options";
import {startTranscribeLocalFileApi, TranscribeOptionsDto} from "@/request/media";
import {TransmitProgressState} from "@/components/ui/transmit-progress-bar";
import {useWorkspace} from "@/components/provider/workspace-provider";
import AddWorkspaceDialog from "@/components/dialog/workspace/add-dialog";
import {useToast} from "@/components/ui/use-toast";
import {useTranslation} from "@/app/i18n/client";

export interface MediaUploaderProps {
  children: React.ReactNode
}

export default function MediaUploader({children}: MediaUploaderProps) {
  const {currentWorkspace} = useWorkspace();
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<TransmitProgressState>();
  const {toast} = useToast();
  const {t} = useTranslation();

  const handleFileChange = useCallback((file?: File) => {
    if (!file)
      return;
    setFile(file);
    setDialogOpen(true);
  }, [])

  const handleSubmit = useCallback(async (options: TranscribeOptionsDto) => {
    if (!file)
      return;
    await startTranscribeLocalFileApi(file, options, currentWorkspace?.id ?? 0, e => {
      setProgress(e);
    });
    setDialogOpen(false);
    setProgress(undefined);
  }, [currentWorkspace?.id, file])

  return (
    <AddWorkspaceDialog>
      {openAddWorkspaceDialog => (
        <>
          <div onClick={() => {
            if (currentWorkspace === null) {
              toast({
                title: t('toast.noWorkspace.title'),
                duration: 3000
              })
              return openAddWorkspaceDialog(true);
            }
            fileInputRef.current!.value = "";
            fileInputRef.current!.click();
          }}>
            {children}
          </div>
          <input ref={fileInputRef} hidden type={"file"} onChange={e => handleFileChange(e.target.files?.[0])}/>
          <TranscribeOptionsDialog progress={progress} open={dialogOpen} onOpenChange={setDialogOpen}
                                   onSubmit={handleSubmit}/>
        </>
      )}
    </AddWorkspaceDialog>
  )
}