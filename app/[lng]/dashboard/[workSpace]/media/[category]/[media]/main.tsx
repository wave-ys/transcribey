'use client';

import Player from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/player";
import TranscriptionList from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/transcription-list";
import React, {RefObject, useState} from "react";
import {MediaModel} from "@/request/media";
import {TranscriptionModel} from "@/request/transcription";
import {MediaPlayerInstance} from "@vidstack/react";

export interface MediaMainProps {
  media: MediaModel;
  lng: string;
  transcriptions: TranscriptionModel;
}

export default function MediaMain({media, lng, transcriptions}: MediaMainProps) {
  const [ref, setRef] = useState<RefObject<MediaPlayerInstance>>()

  return (
    <div className={"h-full flex flex-col"}>
      <Player refUpdate={setRef} className={"h-2/3 flex-shrink"} media={media} lng={lng}/>
      <div className={"my-2 flex-auto overflow-y-auto"}>
        <TranscriptionList playerRef={ref} list={transcriptions}/>
      </div>
    </div>
  )
}