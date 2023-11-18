'use server';

import {addWorkspaceApi, AddWorkspaceDto} from "@/request/workspace";
import {serverRequest} from "@/request";

export async function submitAddDialog(data: AddWorkspaceDto) {
  await addWorkspaceApi(serverRequest, data);
}