'use client';

import Player from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/player";
import TranscriptionList, {
  TranscriptionState
} from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/transcription-list";
import React, {RefObject, useEffect, useState} from "react";
import {MEDIA_STATUS_COMPLETED, MediaModel} from "@/request/media";
import {subscribeTranscribeUpdateApi, TranscriptionModel} from "@/request/transcription";
import {MediaPlayerInstance} from "@vidstack/react";
import MediaTopBar from "@/app/[lng]/dashboard/[workspace]/media/[category]/[media]/top-bar";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";

export interface MediaMainProps {
  media: MediaModel;
  lng: string;
  transcriptions: TranscriptionModel;
}

export interface TranscribeProgressMessage {
  total: number;
  progress: number;
  segments: TranscriptionModel;
}

export interface TranscribeProgress {
  total: number;
  progress: number;
}

export default function MediaMain({media, lng, transcriptions}: MediaMainProps) {
  const [ref, setRef] = useState<RefObject<MediaPlayerInstance>>()
  const router = useRouter();
  const [modified, setModified] = useState(false);
  const [transcriptionStates, setTranscriptionStates] = useState<TranscriptionState[]>(transcriptions.map(item => ({
    ...item,
    current: item.text,
    deleted: false
  })));
  const [progress, setProgress] = useState<TranscribeProgress>();

  useEffect(() => {
    if (media.status === MEDIA_STATUS_COMPLETED) {
      setProgress(undefined);
      return;
    }

    const s = subscribeTranscribeUpdateApi(media.id);
    const handleMessage = (e: WebSocketEventMap['message']) => {
      if (e.data === 'pong')
        return;
      if (e.data === 'complete') {
        router.refresh();
        return;
      }
      const received = JSON.parse(e.data) as TranscribeProgressMessage;
      setTranscriptionStates(prev => ([
        ...prev,
        ...received.segments.map(item => ({...item, current: item.text, deleted: false}))
      ]))
      setProgress(received);
    }
    const handleOpen = (e: WebSocketEventMap['open']) => s.send('ping');

    s.addEventListener('open', handleOpen);
    s.addEventListener('message', handleMessage);

    const interval = setInterval(() => {
      if (s.readyState === 1)
        s.send('ping');
    }, 15 * 1000);

    return () => {
      clearInterval(interval);
      s.removeEventListener('open', handleOpen);
      s.removeEventListener('message', handleMessage);
      s.close();
    };
  }, [router, media.id, media.status]);

  return (
    <div className={"h-full flex flex-col"}>
      <MediaTopBar modified={modified}
                   className={cn("flex-none mb-3", media.status !== MEDIA_STATUS_COMPLETED && "invisible")}
                   transcriptions={transcriptionStates}
                   currentMedia={media}/>
      <Player refUpdate={setRef} className={"h-auto flex-shrink max-h-[66%]"} media={media} lng={lng}/>
      <TranscriptionList className={"my-2 flex flex-col flex-grow h-0"} playerRef={ref} list={transcriptionStates}
                         onUpdateList={setTranscriptionStates}
                         onModified={setModified} media={media} progress={progress}/>
    </div>
  )
}