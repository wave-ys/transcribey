import {request} from "@/request/index";
import {AxiosProgressEvent} from "axios";

export interface TranscribeOptionsDto {
  model: string;
  language: string;
}

export interface MediaModel {
  id: number,
  fileName: string,
  model: string,
  language: string,
  fileType: string,
  status: string,
  failed: boolean,
  failedReason: string,
  deleted: boolean,
  createdTime: string,
  workspaceId: number
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

export async function getMediaListApi(
  workspaceId: number,
  category: 'all' | 'video' | 'audio',
  deleted: boolean
) {
  return request<MediaModel[]>({
    url: '/api/media',
    method: 'get',
    params: {
      workspace: workspaceId,
      category,
      deleted
    }
  })
}

export async function deleteMediaApi(id: number, permanent: boolean) {
  return request({
    url: '/api/media/' + id,
    method: 'delete',
    params: {
      permanent
    }
  })
}