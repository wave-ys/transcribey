import React from "react";
import {redirect} from "next/navigation";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useTranslation} from "@/app/i18n";
import Link from "next/link";

interface MediaLayoutProps {
  params: {
    lng: string,
    workspace: string,
    category: string | 'all' | 'video' | 'audio'
  },
  children: React.ReactNode
}

export default async function MediaLayout({children, params}: MediaLayoutProps) {
  const {t} = await useTranslation(params.lng)

  if (params.category !== 'all' && params.category !== 'video' && params.category !== 'audio')
    return redirect(`/${params.lng}/dashboard/${params.workspace}/media/all`);

  return (
    <div className={"flex flex-col space-y-2"}>
      <div className={"flex-none"}>
        <Tabs defaultValue={params.category}>
          <TabsList>
            <Link href={`/${params.lng}/dashboard/${params.workspace}/media/all`}>
              <TabsTrigger value={'all'}>{t("media.tabs.all")}</TabsTrigger>
            </Link>
            <Link href={`/${params.lng}/dashboard/${params.workspace}/media/video`}>
              <TabsTrigger value={'video'}>{t("media.tabs.video")}</TabsTrigger>
            </Link>
            <Link href={`/${params.lng}/dashboard/${params.workspace}/media/audio`}>
              <TabsTrigger value={'audio'}>{t("media.tabs.audio")}</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
      <div className={"flex-auto flex"}>
        <div className={"flex-none"}></div>
        <div className={"flex-auto"}>{children}</div>
      </div>
    </div>
  )
}