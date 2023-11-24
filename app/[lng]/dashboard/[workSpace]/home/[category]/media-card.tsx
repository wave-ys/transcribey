import {MediaModel} from "@/request/media";
import {TimeDistance} from "@/components/date-display";
import {cn} from "@/lib/utils";
import Image from "next/image";

export interface MediaCardProps {
  media: MediaModel;
  lng: string;
  className: string;
}

export default function MediaCard({media, lng, className}: MediaCardProps) {
  return (
    <div className={cn(
      "h-80 w-64 shadow rounded-2xl overflow-hidden",
      "flex flex-col cursor-pointer",
      "hover:-translate-y-1 hover:shadow-md transition",
      className
    )}>
      <div className={"h-52 flex-none relative"}>
        <Image sizes={"26rem, 32rem"} priority className={"object-cover"} fill src={`/api/thumbnail/${media.id}`}
               alt={media.fileName}/>
      </div>
      <div className={"bg-white/10 flex-auto p-2 space-y-2"}>
        <div className={"text-gray-500 text-sm"}>
          <TimeDistance lng={lng} date={media.createdTime}/>
        </div>
        <div className={"font-extrabold overflow-ellipsis whitespace-nowrap overflow-x-hidden"}>
          {media.fileName}
        </div>
        <div className={"line-clamp-2 text-gray-500 text-xs"}>
          This is the micro machine representing the most miniature motorcade of Michael Scheme.
        </div>
      </div>
    </div>
  )
}