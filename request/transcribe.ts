import {request} from "@/request/index";
import {AxiosProgressEvent} from "axios";

export interface TranscribeOptionsDto {
  model: string;
  language: string
}

function convertToFormData(options: TranscribeOptionsDto) {
  const formData = new FormData();
  formData.append('model', options.model);
  formData.append('language', options.language);
  return formData;
}

export async function startTranscribeLocalFileApi(
  file: File,
  options: TranscribeOptionsDto,
  onProgress?: (e: AxiosProgressEvent) => void) {
  const formData = convertToFormData(options);
  formData.append('file', file);
  return request<void>({
    url: '/api/transcribe/upload',
    method: 'post',
    data: formData,
    onUploadProgress: onProgress,
    maxBodyLength: Infinity,
    maxContentLength: Infinity
  });
}