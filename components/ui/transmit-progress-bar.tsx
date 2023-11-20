import {Progress} from "@/components/ui/progress";
import {useMemo} from "react";
import {useTranslation} from "@/app/i18n/client";

export interface TransmitProgressState {
  total?: number,
  progress?: number,
  rate?: number,
  estimated?: number
}

export default function TransmitProgressBar({state}: { state: TransmitProgressState }) {
  const {t} = useTranslation();
  const progressText = useMemo(() => {
    if (state.progress === undefined)
      return "";

    return new Intl.NumberFormat(undefined, {
      style: "percent"
    }).format(state.progress);
  }, [state.progress])

  return (
    <div className={"text-sm text-gray-500"}>
      <div className={"flex justify-between"}>
        {
          state.progress === 1 ?
            <span>{t("transmitProgressBar.processing")}</span> :
            <span>{t("transmitProgressBar.uploading")}</span>
        }
        <span>{progressText}</span>
      </div>
      <Progress value={state.progress ? state.progress * 100 : 0}/>
    </div>
  )
}