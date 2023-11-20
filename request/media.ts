import {request} from "@/request/index";
import {AxiosProgressEvent} from "axios";

export interface TranscribeOptionsDto {
  model: string;
  language: string;
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
  workspaceId: number,
  onProgress?: (e: AxiosProgressEvent) => void) {
  const formData = convertToFormData(options);
  formData.append('file', file);
  formData.append('workspaceId', workspaceId + "");
  return request<void>({
    url: '/api/media/upload',
    method: 'post',
    data: formData,
    onUploadProgress: onProgress,
    maxBodyLength: Infinity,
    maxContentLength: Infinity
  });
}