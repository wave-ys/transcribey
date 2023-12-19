import {request} from "@/request/index";

export async function ExportWithSoftSubtitlesApi(id: number, srtSubtitles: string, onProgress?: (progress: number) => void) {
  return request<Blob>({
    url: '/api/export/soft/' + id,
    method: 'post',
    data: srtSubtitles,
    headers: {
      "Content-Type": "text/plain"
    },
    responseType: 'blob',
    onDownloadProgress(e) {
      if (e.progress !== undefined)
        onProgress?.(e.progress);
      console.log(e.progress);
    }
  });
}