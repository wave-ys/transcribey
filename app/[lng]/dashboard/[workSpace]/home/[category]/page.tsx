import React from "react";
import {useTranslation} from "@/app/i18n";
import CardButton from "@/components/ui/card-button";
import {LuUpload} from "react-icons/lu";
import MediaUploader from "@/app/[lng]/dashboard/[workspace]/home/[category]/media-uploader";
import {redirect} from "next/navigation";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Link from "next/link";
import {getMediaListApi} from "@/request/media";
import MediaCard from "@/app/[lng]/dashboard/[workspace]/home/[category]/media-card";

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

  const {data: medias} =
    workspace === '_' ? {data: []} : await getMediaListApi(+workspace, category, false)

  return (
    <div className={"p-12"}>
      <div>
        {t("home.welcomePrefix")}
        <span className={"text-blue-600"}>Transcribey</span>
        {t("home.welcomeSuffix")}
      </div>

      <div className={"flex mt-8 mb-16"}>
        <MediaUploader>
          <CardButton
            icon={<LuUpload/>}
            title={t("home.localFileButton.title")}
            subtitle={t("home.localFileButton.subtitle")}/>
        </MediaUploader>
      </div>

      <Tabs defaultValue={category}>
        <TabsList>
          <Link href={`/${lng}/dashboard/${workspace}/home/all`}>
            <TabsTrigger value={'all'}>{t("media.tabs.all")}</TabsTrigger>
          </Link>
          <Link href={`/${lng}/dashboard/${workspace}/home/video`}>
            <TabsTrigger value={'video'}>{t("media.tabs.video")}</TabsTrigger>
          </Link>
          <Link href={`/${lng}/dashboard/${workspace}/home/audio`}>
            <TabsTrigger value={'audio'}>{t("media.tabs.audio")}</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      <div className={"mt-8 flex-wrap flex"}>
        {medias.map(media => (
          <Link key={media.id} href={`/${lng}/dashboard/${workspace}/media/${category}/${media.id}`}>
            <MediaCard className={"mr-2 mt-2"} lng={lng} media={media}/>
          </Link>
        ))}
      </div>
    </div>
  )
}