import {request} from "@/request/index";

export interface TranscriptionItem {
  start: number;
  end: number;
  text: string;
}

export type TranscriptionModel = TranscriptionItem[]

export default function getTranscriptionApi(mediaId: number) {
  return request<TranscriptionModel>({
    url: '/api/transcription/' + mediaId,
    method: 'get'
  })
}