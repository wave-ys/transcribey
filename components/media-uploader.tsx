'use client';

import React, {useCallback, useRef, useState} from "react";
import TranscribeOptionsDialog from "@/components/dialog/transcribe-options";
import {TranscribeOptionsDto} from "@/request/transcribe";
import {submitTranscribeLocalFile} from "@/components/dialog/transcribe-options/actions";

export interface MediaUploaderProps {
  children: React.ReactNode
}

export default function MediaUploader({children}: MediaUploaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', options.model);
    formData.append('language', options.language);
    await submitTranscribeLocalFile(formData);
    setDialogOpen(false);
  }, [file])

  return (
    <>
      <div onClick={handleClick}>
        {children}
      </div>
      <input ref={fileInputRef} hidden type={"file"} onChange={e => handleFileChange(e.target.files?.[0])}/>
      <TranscribeOptionsDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit}/>
    </>
  )
}