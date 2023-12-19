import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import React, {useCallback, useState} from "react";
import {useTranslation} from "@/app/i18n/client";
import {Sidebar, SidebarItem, SidebarSection} from "@/components/ui/sidebar";
import {TranscriptionModel} from "@/request/transcription";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {MediaModel} from "@/request/media";
import {ExportWithSoftSubtitlesApi} from "@/request/export";
import {cn} from "@/lib/utils";


// https://deepgram.com/learn/generate-webvtt-srt-captions-nodejs
const textFormatItems: {
  title: string,
  formatter: (transcriptions: TranscriptionModel) => string,
  icon?: React.ReactNode
}[] = [
  {
    title: ".srt",
    formatter: (transcriptions) => {
      let result = "";
      for (let i = 0; i < transcriptions.length; i++) {
        const item = transcriptions[i];
        const start = new Date(item.start * 1000).toISOString().substring(11, 23).replace('.', ',');
        const end = new Date(item.end * 1000).toISOString().substring(11, 23).replace('.', ',');
        result += `${i + 1}\n${start} --> ${end}\n${item.text}\n\n`;
      }
      return result;
    }
  },
  {
    title: ".vtt",
    formatter: (transcriptions) => {
      let result = "WEBVTT\n\n";
      for (let i = 0; i < transcriptions.length; i++) {
        const item = transcriptions[i];
        const start = new Date(item.start * 1000).toISOString().substring(11, 23);
        const end = new Date(item.end * 1000).toISOString().substring(11, 23);
        result += `${start} --> ${end}\n${item.text}\n\n`;
      }
      return result;
    }
  },
  {
    title: ".lrc",
    formatter: (transcriptions) => {
      let result = "";
      for (let i = 0; i < transcriptions.length; i++) {
        const {start, text} = transcriptions[i];
        const xx = (Math.floor(start * 100) % 100).toString().padStart(2, '0');
        const ss = (Math.floor(start) % 60).toString().padStart(2, '0');
        const mm = (Math.floor(start / 60) % 60).toString().padStart(2, '0');
        result += `[${mm}:${ss}.${xx}]${text}\n`;
      }
      return result;
    }
  },
  {
    title: ".md",
    formatter: (transcriptions) => {
      let result = "";
      for (let i = 0; i < transcriptions.length; i++) {
        const {text} = transcriptions[i];
        result += `${i + 1}. ${text}\n`;
      }
      return result;
    }
  },
  {
    title: ".txt",
    formatter: (transcriptions) => {
      let result = "";
      for (let i = 0; i < transcriptions.length; i++) {
        if (i) result += "\n\n";
        const {text} = transcriptions[i];
        result += `${text}`;
      }
      return result;
    }
  }
]

export interface ExportTranscriptionDialogProps {
  children: React.ReactNode,
  transcriptions: TranscriptionModel;
  media: MediaModel;
}

export default function ExportTranscriptionDialog({children, transcriptions, media}: ExportTranscriptionDialogProps) {
  const {t} = useTranslation();
  const [currentTextFormat, setCurrentTextFormat] = useState(textFormatItems[0].title);
  const [exportVideoProgress, setExportVideoProgress] = useState(1);

  const handleExportText = useCallback(() => {
    const current = textFormatItems.find(item => item.title === currentTextFormat);
    if (current === undefined)
      return;
    const text = current.formatter(transcriptions);
    const url = window.URL.createObjectURL(new Blob([text]));
    const link = document.createElement('a');
    link.hidden = true;
    link.download = media.fileName.split('.').slice(0, -1).join('.') + current.title;
    link.href = url;
    link.click();
    link.remove();
  }, [currentTextFormat, transcriptions, media.fileName])

  const handleExportVideo = useCallback(async () => {
    setExportVideoProgress(0);
    const subtitles = textFormatItems[0].formatter(transcriptions);
    const {data} = await ExportWithSoftSubtitlesApi(media.id, subtitles, setExportVideoProgress);
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.hidden = true;
    link.download = media.fileName;
    link.href = url;
    link.click();
    link.remove();
  }, [media.id, media.fileName, transcriptions])


  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={"max-w-4xl"}>
        <DialogHeader>
          <DialogTitle>{t("media.transcriptions.export.title")}</DialogTitle>
        </DialogHeader>
        <div className={"grid grid-cols-4"}>
          <div className={"border-r pl-0 pr-4 col-span-1 pt-4 "}>
            <Sidebar className={"h-[26rem]"}>
              <SidebarSection>
                {
                  textFormatItems.map(item => (
                    <SidebarItem key={item.title} active={currentTextFormat === item.title}
                                 onClick={() => setCurrentTextFormat(item.title)} icon={item.icon}>
                      {item.title}
                    </SidebarItem>
                  ))
                }
              </SidebarSection>
            </Sidebar>
            <div className={"space-y-2"}>
              <Button className={"w-full"} variant={'outline'}
                      onClick={handleExportText}>{t("media.transcriptions.export.transcriptions")}</Button>
              {media.fileType === 'video' &&
                  <Button onClick={handleExportVideo} variant={'outline'} disabled={exportVideoProgress < 1}
                          className={cn("w-full relative", exportVideoProgress < 1 && "p-0")}>
                    {exportVideoProgress >= 1 ? t("media.transcriptions.export.video") :
                      <>
                        <span className={"absolute top-0 left-0 bottom-0 bg-muted"}
                              style={{right: (1 - exportVideoProgress) * 100 + "%"}}></span>
                        <span
                          className={"mix-blend-difference"}>{new Intl.NumberFormat(undefined, {style: "percent"}).format(exportVideoProgress)}</span>
                      </>
                    }
                  </Button>}
            </div>
          </div>
          <div className={"col-span-3 pl-4"}>
            <Textarea readOnly className={"w-full h-full resize-none text-base"}
                      value={textFormatItems.find(item => item.title === currentTextFormat)?.formatter(transcriptions)}/>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}