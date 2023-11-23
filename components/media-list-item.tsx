import {MediaModel} from "@/request/media";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {AiOutlineEllipsis} from "react-icons/ai";
import {useTranslation} from "@/app/i18n";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {TimeDistance} from "@/components/date-display";


export interface MediaListItemProps {
  media: MediaModel,
  lng: string,
  active: boolean
}

export default async function MediaListItem({media, lng, active}: MediaListItemProps) {
  const {t} = await useTranslation(lng);

  return (
    <div className={cn(
      "border rounded-xl p-2 flex space-x-2 cursor-pointer",
      "hover:border-blue-600",
      active && "border-blue-600"
    )}>
      <div className={"space-y-2 flex-auto min-w-0"}>
        <div className={"flex justify-between items-center space-x-4"}>
          <span
            className={"font-extrabold whitespace-nowrap overflow-x-hidden overflow-ellipsis"}>{media.fileName}</span>
          <span className={"text-xs text-muted-foreground flex-auto whitespace-nowrap"}>
          <TimeDistance lng={lng} date={media.createdTime}/>
        </span>
        </div>
        <div className={"text-sm text-muted-foreground line-clamp-2"}>
          This is the micro machine representing the most miniature motorcade of Michael Scheme.
        </div>
      </div>

      <div className={"flex-none flex items-center space-x-2"}>
        <span
          className={"dark:bg-muted rounded-full py-0.5 px-2 text-xs flex items-center w-fit space-x-2 h-fit"}>
          <div className={"h-1 w-1 rounded-full bg-blue-600"}></div>
          <span>{t("media.fileType." + media.fileType)}</span>
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'} size={'icon'}><AiOutlineEllipsis/></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>{t("media.listItem.dropDownMenu.subtitleEditing")}</DropdownMenuItem>
            <DropdownMenuItem>{t("media.listItem.dropDownMenu.delete")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  )
}