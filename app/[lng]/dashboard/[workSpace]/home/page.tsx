import React from "react";
import {useTranslation} from "@/app/i18n";
import CardButton from "@/components/ui/card-button";
import {LuUpload} from "react-icons/lu";
import MediaUploader from "@/components/media-uploader";

interface HomeProps {
  params: {
    lng: string,
    workspace: string
  }
}

export default async function Home({params: {lng}}: HomeProps) {
  const {t} = await useTranslation(lng);

  return (
    <div className={"p-12"}>
      <div>
        {t("home.welcomePrefix")}
        <span className={"text-blue-600"}>Transcribey</span>
        {t("home.welcomeSuffix")}
      </div>

      <div className={"flex mt-8"}>
        <MediaUploader>
          <CardButton
            icon={<LuUpload/>}
            title={t("home.localFileButton.title")}
            subtitle={t("home.localFileButton.subtitle")}/>
        </MediaUploader>
      </div>
    </div>
  )
}