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