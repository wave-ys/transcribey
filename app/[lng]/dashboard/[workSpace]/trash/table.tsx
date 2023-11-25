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
import {
  deleteMediasAction,
  permanentlyDeleteMediaAction,
  putBackMediaAction
} from "@/app/[lng]/dashboard/[workspace]/trash/actions";
import {useRouter} from "next/navigation";
import {Checkbox} from "@/components/ui/checkbox";
import {useEffect, useMemo, useState} from "react";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

export default function TrashTable({data, lng, sidebarOpen}: {
  data: MediaModel[],
  lng: string,
  sidebarOpen: boolean
}) {
  const {t} = useTranslation();
  const router = useRouter();
  const [checkStates, setCheckStates] = useState<boolean[]>([]);
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(() => data.filter(m => m.fileName.indexOf(searchText) !== -1), [data, searchText])

  useEffect(() => {
    setCheckStates(filteredData.map(_ => false));
  }, [filteredData]);

  const allChecked = useMemo(() => checkStates.length > 0 && checkStates.every(s => s), [checkStates])
  const anyChecked = useMemo(() => checkStates.length > 0 && checkStates.some(s => s), [checkStates])

  return (
    <div className={"space-y-4"}>
      <div className={cn("pl-12 flex space-x-2", sidebarOpen && "lg:pl-0")}>
        <Input className={"w-64"} placeholder={t("trash.toolbar.searchPlaceholder")} value={searchText}
               onChange={e => setSearchText(e.target.value)}/>
        <Button className={cn(!anyChecked && "hidden")} variant={"destructive"}
                onClick={async () => {
                  await deleteMediasAction(
                    checkStates.map((value, index) => value ? filteredData[index] : null)
                      .filter(m => m)
                      .map(m => m!.id));
                  router.refresh();
                }}>
          {t("trash.toolbar.delete")}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox checked={allChecked} onCheckedChange={s => {
                  if (checkStates.length > 0)
                    setCheckStates(checkStates.map(state => !allChecked));
                }}/>
              </TableHead>
              <TableHead>{t("trash.columns.thumbnail")}</TableHead>
              <TableHead>{t("trash.columns.fileName")}</TableHead>
              <TableHead>{t("trash.columns.createdAt")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((media, index) => (
              <TableRow key={media.id}>
                <TableCell>
                  <Checkbox checked={checkStates[index]} onCheckedChange={s => {
                    const newStates = [...checkStates];
                    newStates[index] = !newStates[index];
                    setCheckStates(newStates);
                  }}/>
                </TableCell>
                <TableCell>
                  <div className={"h-12 w-28 relative"}>
                    <Image priority className={"object-cover"} fill sizes={"6rem, 14rem"}
                           src={media.fileType === 'video' ? `/api/resource/thumbnail/${media.id}` : musicCover}
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
    </div>
  )
}