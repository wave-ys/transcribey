import {request} from "@/request/index";

export async function ExportWithSoftSubtitlesApi(id: number, srtSubtitles: string) {
  return request<Blob>({
    url: '/api/export/soft/' + id,
    method: 'post',
    data: srtSubtitles,
    headers: {
      "Content-Type": "text/plain"
    },
    responseType: 'blob'
  });
}