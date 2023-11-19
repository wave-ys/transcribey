import {request} from "@/request/index";

export interface WorkspaceModel {
  id: number;
  label: string;
  color: string;
}

export type AddWorkspaceDto = Omit<WorkspaceModel, "id">
export type UpdateWorkspaceDto = WorkspaceModel

export async function getWorkspaceListApi() {
  return request<WorkspaceModel[]>({
    url: '/api/workspace',
    method: 'get'
  });
}

export async function addWorkspaceApi(data: AddWorkspaceDto) {
  return request<WorkspaceModel>({
    url: '/api/workspace',
    method: 'post',
    data
  })
}

export async function updateWorkspaceApi(data: UpdateWorkspaceDto) {
  return request({
    url: '/api/workspace/' + data.id,
    method: 'put',
    data
  })
}

export async function deleteWorkspaceApi(id: number) {
  return request({
    url: '/api/workspace/' + id,
    method: 'delete',
  })
}