import {request} from "@/request/index";

export interface TranscriptionItem {
  start: number;
  end: number;
  text: string;
}

export type TranscriptionModel = TranscriptionItem[]

export function getTranscriptionApi(mediaId: number) {
  return request<TranscriptionModel>({
    url: '/api/transcription/' + mediaId,
    method: 'get'
  })
}

export function saveTranscriptionApi(mediaId: number, data: TranscriptionModel) {
  return request({
    url: '/api/transcription/' + mediaId,
    method: 'put',
    data
  })
}

export function subscribeTranscribeUpdateApi(mediaId: number) {
  return new WebSocket(`${process.env.NEXT_PUBLIC_WS_PATH}/api/transcription/${mediaId}/ws`);
}