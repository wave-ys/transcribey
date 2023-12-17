import React, {useCallback} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useTranslation} from "@/app/i18n/client";
import {BiExport} from "react-icons/bi";
import {TranscriptionState} from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/transcription-list";
import {saveTranscriptionApi} from "@/request/transcription";
import {MediaModel} from "@/request/media";
import ExportTranscriptionDialog from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/export-dialog";

export interface MediaTopBarProps extends React.HTMLProps<HTMLDivElement> {
  modified?: boolean;
  transcriptions: TranscriptionState[];
  currentMedia: MediaModel;
}

export default function MediaTopBar({className, modified, transcriptions, currentMedia}: MediaTopBarProps) {
  const {t} = useTranslation();

  const handleSave = useCallback(async () => {
    await saveTranscriptionApi(currentMedia.id,
      transcriptions
        .filter(item => !item.deleted)
        .map(item => ({
          start: item.start,
          end: item.end,
          text: item.current
        })));
    location.reload();
  }, [currentMedia.id, transcriptions])

  return (
    <div className={cn("w-fit ml-auto space-x-3 flex items-center", className)}>
      <ExportTranscriptionDialog>
        <Button variant={"outline"}>
          <BiExport className={"w-4 h-4 mr-2"}/>
          {t("media.transcriptions.export")}
        </Button>
      </ExportTranscriptionDialog>
      {modified && <Button onClick={handleSave}>{t("media.transcriptions.save")}</Button>}
    </div>
  )
}