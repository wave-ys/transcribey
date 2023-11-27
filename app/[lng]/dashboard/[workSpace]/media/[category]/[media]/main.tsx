'use client';

import Player from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/player";
import TranscriptionList from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/transcription-list";
import React, {RefObject, useState} from "react";
import {MediaModel} from "@/request/media";
import {TranscriptionModel} from "@/request/transcription";
import {MediaPlayerInstance} from "@vidstack/react";
import MediaTopBar from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/top-bar";

export interface MediaMainProps {
  media: MediaModel;
  lng: string;
  transcriptions: TranscriptionModel;
}

export default function MediaMain({media, lng, transcriptions}: MediaMainProps) {
  const [ref, setRef] = useState<RefObject<MediaPlayerInstance>>()
  const [modified, setModified] = useState(false);

  return (
    <div className={"h-full flex flex-col"}>
      <MediaTopBar modified={modified} className={"flex-none mb-3"}/>
      <Player refUpdate={setRef} className={"h-auto flex-shrink max-h-[66%;]"} media={media} lng={lng}/>
      <TranscriptionList className={"my-2 flex flex-col flex-grow h-0"} playerRef={ref} list={transcriptions}
                         onModified={setModified}/>
    </div>
  )
}