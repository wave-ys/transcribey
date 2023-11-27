import React from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useTranslation} from "@/app/i18n/client";
import {BiExport} from "react-icons/bi";

export interface MediaTopBarProps extends React.HTMLProps<HTMLDivElement> {
  modified?: boolean
}

export default function MediaTopBar({className, modified}: MediaTopBarProps) {
  const {t} = useTranslation();

  return (
    <div className={cn("w-fit ml-auto space-x-3 flex items-center", className)}>
      <Button variant={"outline"}>
        <BiExport className={"w-4 h-4 mr-2"}/>
        {t("media.transcriptions.export")}
      </Button>
      {modified && <Button>{t("media.transcriptions.save")}</Button>}
    </div>
  )
}