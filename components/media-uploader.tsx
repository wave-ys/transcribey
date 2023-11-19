'use client';

import React, {useCallback, useRef, useState} from "react";
import TranscribeOptionsDialog from "@/components/dialog/transcribe-options";
import {startTranscribeLocalFileApi, TranscribeOptionsDto} from "@/request/transcribe";
import {TransmitProgressState} from "@/components/ui/transmit-progress-bar";

export interface MediaUploaderProps {
  children: React.ReactNode
}

export default function MediaUploader({children}: MediaUploaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<TransmitProgressState>();

  const handleClick = useCallback(() => {
    fileInputRef.current!.value = "";
    fileInputRef.current!.click();
  }, [])

  const handleFileChange = useCallback((file?: File) => {
    if (!file)
      return;
    setFile(file);
    setDialogOpen(true);
  }, [])

  const handleSubmit = useCallback(async (options: TranscribeOptionsDto) => {
    if (!file)
      return;
    await startTranscribeLocalFileApi(file, options, e => {
      setProgress(e);
    });
    setDialogOpen(false);
    setProgress(undefined);
  }, [file])

  return (
    <>
      <div onClick={handleClick}>
        {children}
      </div>
      <input ref={fileInputRef} hidden type={"file"} onChange={e => handleFileChange(e.target.files?.[0])}/>
      <TranscribeOptionsDialog progress={progress} open={dialogOpen} onOpenChange={setDialogOpen}
                               onSubmit={handleSubmit}/>
    </>
  )
}