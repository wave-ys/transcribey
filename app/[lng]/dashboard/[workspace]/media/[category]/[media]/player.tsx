import {MediaPlayer, MediaPlayerInstance, MediaProvider, Poster} from "@vidstack/react";
import {defaultLayoutIcons, DefaultVideoLayout} from "@vidstack/react/player/layouts/default";
import React, {RefObject, useEffect, useRef} from "react";
import {MediaModel} from "@/request/media";

import './style.css'
import {cn} from "@/lib/utils";
import translations from "@/app/i18n/vidstack";

export interface PlayerProps {
  media: MediaModel;
  className?: string;
  lng: string;
  refUpdate?: (ref: RefObject<MediaPlayerInstance>) => void;
}

export default function Player({media, className, lng, refUpdate}: PlayerProps) {
  const ref = useRef<MediaPlayerInstance>(null);
  useEffect(() => {
    refUpdate?.(ref);
  }, [refUpdate]);

  return (
    <MediaPlayer ref={ref} className={cn("h-full", className)} title={media.fileName}
                 src={`/api/resource/media/${media.id}`}>
      <DefaultVideoLayout icons={defaultLayoutIcons} translations={translations[lng as keyof typeof translations]}/>
      <MediaProvider>
        <Poster className="vds-poster object-contain h-full" alt={media.fileName}
                src={`/api/resource/thumbnail/${media.id}`}/>
      </MediaProvider>
    </MediaPlayer>
  )
}