"use server";

import {
  addWorkspaceApi,
  AddWorkspaceDto,
  deleteWorkspaceApi,
  updateWorkspaceApi,
  UpdateWorkspaceDto
} from "@/request/workspace";

export async function deleteWorkspaceAction(id: number) {
  await deleteWorkspaceApi(id);
}

export async function addWorkspaceAction(payload: AddWorkspaceDto) {
  const {data} = await addWorkspaceApi(payload);
  return data;
}

export async function updateWorkspaceAction(data: UpdateWorkspaceDto) {
  await updateWorkspaceApi(data);
}