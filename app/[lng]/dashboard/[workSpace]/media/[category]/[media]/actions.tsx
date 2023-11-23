'use server';

import {deleteMediaApi} from "@/request/media";

export async function deleteMediaAction(id: number) {
  await deleteMediaApi(id, false);
}