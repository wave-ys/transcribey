'use server';

import {addWorkspaceApi, AddWorkspaceDto, updateWorkspaceApi, UpdateWorkspaceDto} from "@/request/workspace";
import {serverRequest} from "@/request";

export async function submitAddDialog(data: AddWorkspaceDto) {
  await addWorkspaceApi(serverRequest, data);
}

export async function submitChangeDialog(data: UpdateWorkspaceDto) {
  await updateWorkspaceApi(serverRequest, data);
}