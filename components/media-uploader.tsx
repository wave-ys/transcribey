'use client';

import React, {useState} from "react";
import TranscribeParameterDialog from "@/components/dialog/transcribe-parameter";

export interface MediaUploaderProps {
  children: React.ReactNode
}

export default function MediaUploader({children}: MediaUploaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div onClick={() => setDialogOpen(true)}>
        {children}
      </div>
      <TranscribeParameterDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
    </>
  )
}