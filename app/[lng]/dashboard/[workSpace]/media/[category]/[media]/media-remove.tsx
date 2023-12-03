'use client';

import {HiOutlineTrash} from "react-icons/hi";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {useTranslation} from "@/app/i18n/client";
import {useAlert} from "@/components/provider/alert-provider";
import {MouseEventHandler, useCallback} from "react";
import {deleteMediaAction} from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/actions";
import {useRouter} from "next/navigation";

export default function MediaRemove(props: { id: number }) {
  const {t} = useTranslation();
  const router = useRouter();
  const alert = useAlert()
  const handleClick : MouseEventHandler<HTMLDivElement> = useCallback(async (e) => {
    e.stopPropagation();
    if (!await alert({
      title: t('media.listItem.deleteConfirm.title'),
      description: t('media.listItem.deleteConfirm.description')
    }))
      return;
    await deleteMediaAction(props.id);
    router.refresh();
  }, [alert, props.id, router, t])

  return (
    <DropdownMenuItem className={"text-destructive"} onClick={handleClick}>
      <HiOutlineTrash className={"w-4 h-4 mr-2"}/>
      {t("media.listItem.dropDownMenu.delete")}
    </DropdownMenuItem>
  )
}