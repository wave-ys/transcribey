"use client";

import {MediaPlayer, MediaProvider, Poster} from "@vidstack/react";
import {defaultLayoutIcons, DefaultVideoLayout} from "@vidstack/react/player/layouts/default";
import React from "react";
import {MediaModel} from "@/request/media";

import './style.css'
import {cn} from "@/lib/utils";
import translations from "@/app/i18n/vidstack";

export interface PlayerProps {
  media: MediaModel;
  className?: string;
  lng: string;
}

export default function Player({media, className, lng}: PlayerProps) {
  return (
    <MediaPlayer className={cn("h-full", className)} title={media.fileName}>
      <DefaultVideoLayout icons={defaultLayoutIcons} translations={translations[lng as keyof typeof translations]}/>
      <MediaProvider>
        <Poster className="vds-poster" alt={media.fileName} src={`/api/resource/thumbnail/${media.id}`}/>
        <source src={`/api/resource/media/${media.id}`} type={media.contentType}/>
      </MediaProvider>
    </MediaPlayer>
  )
}