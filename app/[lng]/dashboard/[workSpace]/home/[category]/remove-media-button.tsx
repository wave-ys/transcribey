'use client';

import {HiOutlineTrash} from "react-icons/hi";
import TransparentButton from "@/app/[lng]/dashboard/[workspace]/home/[category]/transparent-button";
import {useAlert} from "@/components/provider/alert-provider";
import {useCallback} from "react";
import {useTranslation} from "@/app/i18n/client";
import {useRouter} from "next/navigation";
import {deleteMediaAction} from "@/app/[lng]/dashboard/[workspace]/home/[category]/actions";

export interface RemoveMediaButtonProps {
  id: number
}

export default function RemoveMediaButton({id}: RemoveMediaButtonProps) {
  const alert = useAlert();
  const router = useRouter();
  const {t} = useTranslation();

  const handleClick = useCallback(async () => {
    if (!await alert({
      title: t('media.listItem.deleteConfirm.title'),
      description: t('media.listItem.deleteConfirm.description')
    }))
      return;
    await deleteMediaAction(id);
    router.refresh();
  }, [alert, id, router, t])

  return (
    <TransparentButton onClick={handleClick} className={"hover:bg-red-600"}
                       icon={<HiOutlineTrash className={"w-5 h-5"}/>}/>
  )
}