import React from "react";
import {redirect} from "next/navigation";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useTranslation} from "@/app/i18n";
import Link from "next/link";
import {getMediaListApi} from "@/request/media";
import MediaListItem from "@/components/media-list-item";

interface MediaLayoutProps {
  params: {
    lng: string,
    workspace: string,
    category: string | 'all' | 'video' | 'audio' | 'details',
    media: string
  },
  children: React.ReactNode
}

export default async function MediaLayout({children, params}: MediaLayoutProps) {
  const {t} = await useTranslation(params.lng)

  if (params.category !== 'all' && params.category !== 'video' && params.category !== 'audio' && params.category !== 'details')
    return redirect(`/${params.lng}/dashboard/${params.workspace}/media/all`);

  if (params.category === 'details')
    return <>detail</>

  const {data: medias} = await getMediaListApi(+params.workspace, params.category, false)

  return (
    <div className={"flex flex-col space-y-3 h-full"}>
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
      <div className={"flex-auto flex h-0"}>
        <div className={"flex-none w-96 pr-3 space-y-2 pb-3 overflow-y-auto"}>
          {medias.map(media => (
            <Link className={"block"} key={media.id}
                  href={`/${params.lng}/dashboard/${params.workspace}/media/${params.category}/${media.id}`}>
              <MediaListItem active={media.id + "" === params.media} media={media} lng={params.lng}/>
            </Link>
          ))}
        </div>
        <div className={"flex-auto border-l pl-3"}>{children}</div>
      </div>
    </div>
  )
}