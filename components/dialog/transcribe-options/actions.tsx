'use server';

import {startTranscribeLocalFileApi} from "@/request/transcribe";

export async function submitTranscribeLocalFile(data: FormData) {
  await startTranscribeLocalFileApi(data);
}