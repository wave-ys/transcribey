import React from "react";
import {getMediaApi, MediaModel} from "@/request/media";
import {redirect} from "next/navigation";

interface MediaPageProps {
  params: {
    lng: string,
    workspace: string,
    category: string | 'all' | 'video' | 'audio' | 'details',
    media: string
  }
}

export default async function MediaPage({params}: MediaPageProps) {
  if (params.media === '_')
    return <></>
  let media: MediaModel;
  try {
    const {data} = await getMediaApi(+params.media);
    media = data;
  } catch (e) {
    return redirect(`/${params.lng}/dashboard/${params.workspace}/media/${params.category}/_`);
  }

  return (
    <video controls src={`/api/resource/media/${media.id}`}></video>
  )
}