"use client";

import {MediaPlayer, MediaProvider} from "@vidstack/react";
import {defaultLayoutIcons, DefaultVideoLayout} from "@vidstack/react/player/layouts/default";
import React from "react";
import {MediaModel} from "@/request/media";

import './style.css'

export interface PlayerProps {
  media: MediaModel
}

export default function Player({media}: PlayerProps) {
  return (
    <div className={"h-2/3"}>
      <MediaPlayer className={"h-full"} title={media.fileName} src={`/api/resource/media/${media.id}`}>
        <MediaProvider/>
        <DefaultVideoLayout thumbnails={`/api/resource/thumbnail/${media.id}`} icons={defaultLayoutIcons}/>
      </MediaPlayer>
    </div>
  )
}