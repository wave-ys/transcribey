"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {MediaModel} from "@/request/media";
import {useTranslation} from "@/app/i18n/client";
import Image from "next/image";
import musicCover from '@/public/music-cover.jpeg'
import {TimeFormat} from "@/components/date-display";

export default function TrashTable({data, lng}: { data: MediaModel[], lng: string }) {
  const {t} = useTranslation();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("trash.columns.thumbnail")}</TableHead>
            <TableHead>{t("trash.columns.fileName")}</TableHead>
            <TableHead>{t("trash.columns.createdAt")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(media => (
            <TableRow key={media.id}>
              <TableCell>
                <div className={"h-12 w-28 relative"}>
                  <Image priority className={"object-cover"} fill
                         src={media.fileType === 'video' ? `/api/thumbnail/${media.id}` : musicCover}
                         alt={media.fileName}/>
                </div>
              </TableCell>
              <TableCell>
                {media.fileName}
              </TableCell>
              <TableCell>
                <TimeFormat lng={lng} date={media.createdTime}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}