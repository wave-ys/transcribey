"use client";

import {MediaPlayer, MediaProvider} from "@vidstack/react";
import {defaultLayoutIcons, DefaultVideoLayout} from "@vidstack/react/player/layouts/default";
import React from "react";
import {MediaModel} from "@/request/media";

export interface PlayerProps {
  media: MediaModel
}

export default function Player({media}: PlayerProps) {
  return (
    <MediaPlayer title={media.fileName} src={`/api/resource/media/${media.id}`}>
      <MediaProvider/>
      <DefaultVideoLayout thumbnails={`/api/resource/thumbnail/${media.id}`} icons={defaultLayoutIcons}/>
    </MediaPlayer>
  )
}