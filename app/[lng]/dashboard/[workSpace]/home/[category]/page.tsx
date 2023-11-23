import React from "react";
import {useTranslation} from "@/app/i18n";
import CardButton from "@/components/ui/card-button";
import {LuUpload} from "react-icons/lu";
import MediaUploader from "@/app/[lng]/dashboard/[workspace]/home/[category]/media-uploader";
import {redirect} from "next/navigation";

interface HomeProps {
  params: {
    lng: string,
    workspace: string,
    category: string | 'all' | 'video' | 'audio',
  }
}

export default async function Home({params: {lng, category, workspace}}: HomeProps) {
  const {t} = await useTranslation(lng);

  if (category !== 'all' && category !== 'video' && category !== 'audio')
    return redirect(`/${lng}/dashboard/${workspace}/media/all`);

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