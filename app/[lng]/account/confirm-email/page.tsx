import {FaCircleCheck} from "react-icons/fa6";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import * as React from "react";
import {useTranslation} from "@/app/i18n";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";

export interface ConfirmEmailPageProps {
  params: { lng: string }
  searchParams: { user_id: string, success: string }
}

export default async function ConfirmEmailPage(
  {
    searchParams: {user_id: userId, success},
    params: {lng}
  }: ConfirmEmailPageProps
) {
  const {t} = await useTranslation(lng);
  return (
    <div className={"h-full flex justify-center items-center"}>
      {success === 'true' ?
        <Alert className={"grid gap-1 w-[48rem] max-w-[80%]"}>
          <FaCircleCheck className="h-4 w-4"/>
          <AlertTitle>{t("account.confirmEmail.success.title")}</AlertTitle>
          <AlertDescription>{t("account.confirmEmail.success.description")}</AlertDescription>
        </Alert> :
        <Alert variant={"destructive"} className={"grid gap-1 w-[48rem] max-w-[80%]"}>
          <ExclamationTriangleIcon className="h-4 w-4"/>
          <AlertTitle>{t("account.confirmEmail.error.title")}</AlertTitle>
          <AlertDescription>{t("account.confirmEmail.error.description")}</AlertDescription>
        </Alert>}
    </div>
  )
}