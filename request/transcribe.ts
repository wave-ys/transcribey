import {request} from "@/request/index";

export interface TranscribeOptionsDto {
  model: string;
  language: string
}

export async function startTranscribeLocalFileApi(data: FormData) {
  return request<void>({
    url: '/api/transcribe/upload',
    method: 'post',
    data
  });
}