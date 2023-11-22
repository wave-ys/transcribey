import {MediaModel} from "@/request/media";
import {formatDistance} from 'date-fns'
import {toUpperCaseLng} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {AiOutlineEllipsis} from "react-icons/ai";

export interface MediaListItemProps {
  media: MediaModel,
  lng: string
}

export default async function MediaListItem({media, lng}: MediaListItemProps) {
  const dateLocales = await import('date-fns/locale')
  const dateLocale = dateLocales[toUpperCaseLng(lng).split('-').join('') as keyof typeof dateLocales] as Locale;

  return (
    <div className={"border rounded-xl p-2 flex space-x-2"}>
      <div className={"space-y-2 flex-auto min-w-0"}>
        <div className={"flex justify-between items-center space-x-4"}>
          <span
            className={"font-extrabold whitespace-nowrap overflow-x-hidden overflow-ellipsis"}>{media.fileName}</span>
          <span className={"text-xs text-muted-foreground flex-auto whitespace-nowrap"}>
          {formatDistance(new Date(media.createdTime), new Date(), {
            addSuffix: true,
            locale: dateLocale
          })}
        </span>
        </div>
        <div className={"text-sm text-muted-foreground line-clamp-2"}>
          This is the micro machine representing the most miniature motorcade of Michael Scheme.
        </div>
      </div>

      <div className={"flex-none flex items-center space-x-2"}>
        <span
          className={"bg-muted rounded-full py-0.5 px-2 text-xs flex items-center w-fit space-x-2 h-fit"}>
          <div className={"h-1 w-1 rounded-full bg-blue-600"}></div>
          <span>Video</span>
        </span>
        <Button variant={'outline'} size={'icon'}><AiOutlineEllipsis/></Button>
      </div>

    </div>
  )
}