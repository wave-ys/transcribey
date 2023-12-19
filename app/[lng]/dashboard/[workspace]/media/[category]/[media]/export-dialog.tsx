import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import React, {useCallback, useMemo, useState} from "react";
import {useTranslation} from "@/app/i18n/client";
import {Sidebar, SidebarItem, SidebarSection} from "@/components/ui/sidebar";
import {TranscriptionModel} from "@/request/transcription";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {FaCircleCheck} from "react-icons/fa6";
import {cn} from "@/lib/utils";
import {MediaModel} from "@/request/media";


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
  const [currentMediaFormat, setCurrentMediaFormat] = useState('.mp3');
  const [currentTab, setCurrentTab] = useState('text');
  const [onlyWithSubtitle, setOnlyWithSubtitle] = useState(false);

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
  }, [currentTextFormat, transcriptions])

  const exportTextTab = useMemo(() => (
    <div className={"grid grid-cols-4"}>
      <div className={"border-r pl-0 pr-4 col-span-1 pt-4 "}>
        <Sidebar className={"h-[28rem]"}>
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
        <Button className={"w-full"} onClick={handleExportText}>{t("media.transcriptions.export.title")}</Button>
      </div>
      <div className={"col-span-3 pl-4"}>
        <Textarea readOnly className={"w-full h-full resize-none text-base"}
                  value={textFormatItems.find(item => item.title === currentTextFormat)?.formatter(transcriptions)}/>
      </div>
    </div>
  ), [currentTextFormat, handleExportText, t, transcriptions])

  const exportMediaTab = useMemo(() => (
    <div className={"grid grid-cols-4"}>
      <div className={"border-r pl-0 pr-4 col-span-1 pt-4 "}>
        <Sidebar className={"h-[28rem]"}>
          <SidebarSection>
            <SidebarItem active={currentMediaFormat === '.mp3'}
                         onClick={() => setCurrentMediaFormat('.mp3')}>.mp3</SidebarItem>
            <SidebarItem active={currentMediaFormat === '.wav'}
                         onClick={() => setCurrentMediaFormat('.wav')}>.wav</SidebarItem>
            <SidebarItem active={currentMediaFormat === '.mp4'}
                         onClick={() => setCurrentMediaFormat('.mp4')}>.mp4</SidebarItem>
            <SidebarItem active={currentMediaFormat === '.mp4 subtitled'}
                         onClick={() => setCurrentMediaFormat('.mp4 subtitled')}>
              {t("media.transcriptions.export.mp4WithCaption")}
            </SidebarItem>
          </SidebarSection>
        </Sidebar>
        <Button className={"w-full"}>{t("media.transcriptions.export.title")}</Button>
      </div>
      <div className={"col-span-3 pl-4 space-y-2"}>
        <div
          onClick={() => setOnlyWithSubtitle(false)}
          className={cn("rounded-lg p-2 border-2 border-muted cursor-pointer relative", !onlyWithSubtitle && "border-muted-foreground")}>
          <div className={cn("absolute top-2 right-2", onlyWithSubtitle && "hidden")}><FaCircleCheck/></div>
          <div className={"mb-2"}>{t("media.transcriptions.export.keepClipsWithoutSubtitles")}</div>
          <div className={"rounded-lg h-7 bg-primary"}></div>
        </div>
        <div
          onClick={() => setOnlyWithSubtitle(true)}
          className={cn("rounded-lg p-2 border-2 border-muted cursor-pointer relative", onlyWithSubtitle && "border-muted-foreground")}>
          <div className={cn("absolute top-2 right-2", !onlyWithSubtitle && "hidden")}><FaCircleCheck/></div>
          <div className={"mb-2"}>{t("media.transcriptions.export.removeClipsWithoutSubtitles")}</div>
          {
            media.duration === 0 ? <div className={"rounded-lg h-7 bg-primary"}></div> : (
              <div className={"rounded-lg h-7 bg-muted flex overflow-hidden"}>
                {transcriptions.map((item, index) => ({
                  left: index === 0 ? 0 : (item.start - transcriptions[index - 1].end),
                  length: item.end - item.start
                })).map((item, index) => (
                  <div key={index} style={{
                    marginLeft: item.left / media.duration * 100 + "%",
                    width: item.length / media.duration * 100 + "%"
                  }} className={"bg-primary h-full"}></div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  ), [currentMediaFormat, t, onlyWithSubtitle, media.duration, transcriptions]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={"max-w-4xl"}>
        <DialogHeader>
          <DialogTitle>{t("media.transcriptions.export.title")}</DialogTitle>
        </DialogHeader>
        <div className={"w-fit ml-auto"}>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="text">{t("media.transcriptions.export.title")}</TabsTrigger>
              <TabsTrigger value="media">{t("media.transcriptions.export.media")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {currentTab === 'text' ? exportTextTab : exportMediaTab}
      </DialogContent>
    </Dialog>
  )
}