'use client';

import Player from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/player";
import TranscriptionList from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/transcription-list";
import React from "react";
import {MediaModel} from "@/request/media";
import {TranscriptionModel} from "@/request/transcription";

export interface MediaMainProps {
  media: MediaModel;
  lng: string;
  transcriptions: TranscriptionModel;
}

export default function MediaMain({media, lng, transcriptions}: MediaMainProps) {
  return (
    <div className={"h-full flex flex-col"}>
      <Player className={"h-2/3 flex-shrink"} media={media} lng={lng}/>
      <div className={"my-2 flex-auto overflow-y-auto"}>
        <TranscriptionList list={transcriptions}/>
      </div>
    </div>
  )
}