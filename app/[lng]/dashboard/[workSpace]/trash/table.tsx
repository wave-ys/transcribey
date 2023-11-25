"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {MediaModel} from "@/request/media";
import {useTranslation} from "@/app/i18n/client";
import Image from "next/image";
import musicCover from '@/public/music-cover.jpeg'
import {TimeFormat} from "@/components/date-display";
import {Button} from "@/components/ui/button";
import {AiOutlineEllipsis} from "react-icons/ai";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {HiOutlineTrash} from "react-icons/hi";
import {LuUndo2} from "react-icons/lu";
import {permanentlyDeleteMediaAction, putBackMediaAction} from "@/app/[lng]/dashboard/[workspace]/trash/actions";
import {useRouter} from "next/navigation";

export default function TrashTable({data, lng}: { data: MediaModel[], lng: string }) {
  const {t} = useTranslation();
  const router = useRouter();

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
                  <Image priority className={"object-cover"} fill sizes={"6rem, 14rem"}
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
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} size={"icon"}><AiOutlineEllipsis/></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={async () => {
                      await putBackMediaAction(media.id);
                      router.refresh();
                    }}>
                      <LuUndo2 className={"w-4 h-4 mr-2"}/>
                      {t("trash.operations.revoke")}
                    </DropdownMenuItem>
                    <DropdownMenuItem className={"text-destructive"} onClick={async () => {
                      await permanentlyDeleteMediaAction(media.id);
                      router.refresh();
                    }}>
                      <HiOutlineTrash className={"w-4 h-4 mr-2"}/>
                      {t("trash.operations.permanentlyDelete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}