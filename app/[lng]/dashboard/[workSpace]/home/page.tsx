import React from "react";
import {useTranslation} from "@/app/i18n";

interface HomeProps {
  params: {
    lng: string,
    workspace: string
  }
}


export default async function Home({params: {lng, workspace}}: HomeProps) {
  const {t} = await useTranslation(lng);

  return (
    <div className={"p-12"}>
      <div>
        {t("home.welcomePrefix")}
        <span className={"text-blue-600"}>Transcribey</span>
        {t("home.welcomeSuffix")}
      </div>
    </div>
  )
}