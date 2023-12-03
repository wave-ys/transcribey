import {Progress} from "@/components/ui/progress";
import {useMemo} from "react";
import {useTranslation} from "@/app/i18n/client";

export interface TransmitProgressState {
  total: number,
  progress: number,
}

export default function TranscribeProgressBar({state}: { state: TransmitProgressState }) {
  const {t} = useTranslation();
  const progressText = useMemo(() => {
    if (state.progress === undefined)
      return "";

    return new Intl.NumberFormat(undefined, {
      style: "percent"
    }).format(state.progress / state.total);
  }, [state.progress, state.total])

  return (
    <div className={"text-sm text-gray-500"}>
      <div className={"flex justify-between"}>
        {
          state.progress / state.total === 1 ?
            <span>{t("media.transcribing.progressBar.processing")}</span> :
            <span>{t("media.transcribing.progressBar.transcribing")}</span>
        }
        <span>{progressText}</span>
      </div>
      <Progress value={state.progress ? state.progress / state.total * 100 : 0}/>
    </div>
  )
}