import React, {useCallback, useMemo} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useTranslation} from "@/app/i18n/client";
import {BiExport} from "react-icons/bi";
import {TranscriptionState} from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/transcription-list";
import {saveTranscriptionApi, TranscriptionModel} from "@/request/transcription";
import {MEDIA_STATUS_COMPLETED, MediaModel} from "@/request/media";
import ExportTranscriptionDialog from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/export-dialog";
import {LuDownloadCloud} from "react-icons/lu";

export interface MediaTopBarProps extends React.HTMLProps<HTMLDivElement> {
  modified?: boolean;
  transcriptions: TranscriptionState[];
  currentMedia: MediaModel;
}

export default function MediaTopBar({className, modified, transcriptions, currentMedia}: MediaTopBarProps) {
  const {t} = useTranslation();
  const state = useMemo<TranscriptionModel>(() => transcriptions
    .filter(item => !item.deleted)
    .map(item => ({
      start: item.start,
      end: item.end,
      text: item.current
    })), [transcriptions])

  const handleSave = useCallback(async () => {
    await saveTranscriptionApi(currentMedia.id, state);
    location.reload();
  }, [currentMedia.id, state])

  return (
    <div className={cn("w-fit ml-auto space-x-3 flex items-center", className)}>
      <a href={`/api/resource/media/${currentMedia.id}`} download={currentMedia.fileName}>
        <Button variant={"outline"}>
          <LuDownloadCloud className={"w-4 h-4 mr-2"}/>
          {t("media.transcriptions.download")}
        </Button>
      </a>
      {
        currentMedia.status === MEDIA_STATUS_COMPLETED &&
          <ExportTranscriptionDialog transcriptions={state} media={currentMedia}>
              <Button variant={"outline"}>
                  <BiExport className={"w-4 h-4 mr-2"}/>
                {t("media.transcriptions.export.title")}
              </Button>
          </ExportTranscriptionDialog>
      }
      {modified && <Button onClick={handleSave}>{t("media.transcriptions.save")}</Button>}
    </div>
  )
}

