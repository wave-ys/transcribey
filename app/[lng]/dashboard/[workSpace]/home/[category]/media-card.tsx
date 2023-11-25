import {MediaModel} from "@/request/media";
import {TimeDistance} from "@/components/date-display";
import {cn} from "@/lib/utils";
import Image from "next/image";
import musicCover from '@/public/music-cover.jpeg'
import TransparentButton from "@/app/[lng]/dashboard/[workspace]/home/[category]/transparent-button";
import {RiScissors2Line} from "react-icons/ri";
import RemoveMediaButton from "@/app/[lng]/dashboard/[workspace]/home/[category]/remove-media-button";


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
      "group",
      className
    )}>
      <div className={"h-52 flex-none relative"}>
        <div className={"absolute right-1.5 top-1.5 z-10 space-x-1 hidden group-hover:block"}>
          <TransparentButton className={"hover:bg-blue-600"} icon={<RiScissors2Line className={"w-5 h-5"}/>}/>
          <RemoveMediaButton id={media.id}/>
        </div>
        <Image sizes={"26rem, 32rem"} priority className={"object-cover"} fill
               src={media.fileType === 'video' ? `/api/resource/thumbnail/${media.id}` : musicCover}
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
          {media.preface}
        </div>
      </div>
    </div>
  )
}