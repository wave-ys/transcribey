import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import React, {useState} from "react";
import {useTranslation} from "@/app/i18n/client";
import {Sidebar, SidebarItem, SidebarSection} from "@/components/ui/sidebar";
import {TranscriptionState} from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/transcription-list";

const textFormatItems: {
  title: string,
  formatter: (transcriptions: TranscriptionState[]) => string,
  icon?: React.ReactNode
}[] = [
  {
    title: ".srt",
    formatter: () => "srt"
  },
  {
    title: ".vtt",
    formatter: () => "vtt"
  },
  {
    title: ".lrc",
    formatter: () => "lrc"
  },
  {
    title: ".md",
    formatter: () => "md"
  },
  {
    title: ".txt",
    formatter: () => "txt"
  }
]

export interface ExportTranscriptionDialogProps {
  children: React.ReactNode,
  transcriptions: TranscriptionState[];
}

export default function ExportTranscriptionDialog({children, transcriptions}: ExportTranscriptionDialogProps) {
  const {t} = useTranslation();
  const [currentFormat, setCurrentFormat] = useState(textFormatItems[0].title);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={"max-w-4xl"}>
        <DialogHeader>
          <DialogTitle>{t("media.transcriptions.export")}</DialogTitle>
          <div className={"grid grid-cols-4 h-[32rem]"}>
            <Sidebar className={"border-r pl-0 pr-4 col-span-1 pt-4"}>
              <SidebarSection>
                {
                  textFormatItems.map(item => (
                    <SidebarItem key={item.title} active={currentFormat === item.title}
                                 onClick={() => setCurrentFormat(item.title)} icon={item.icon}>
                      {item.title}
                    </SidebarItem>
                  ))
                }
              </SidebarSection>
            </Sidebar>
            <div className={"col-span-3 pl-4"}>
              {textFormatItems.find(item => item.title === currentFormat)?.formatter(transcriptions)}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}