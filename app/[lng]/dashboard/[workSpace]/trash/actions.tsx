'use server';

import {deleteMediaApi, putBackMediaApi} from "@/request/media";

export async function permanentlyDeleteMediaAction(id: number) {
  await deleteMediaApi(id, true);
}

export async function putBackMediaAction(id: number) {
  await putBackMediaApi(id);
}