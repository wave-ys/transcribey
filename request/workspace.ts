import {AxiosInstance} from "axios";

export interface WorkspaceModel {
  id: number;
  label: string;
  color: string;
}

export type AddWorkspaceDto = Omit<WorkspaceModel, "id">
export type UpdateWorkspaceDto = WorkspaceModel

export async function getWorkspaceListApi(request: AxiosInstance) {
  return request<WorkspaceModel[]>({
    url: '/api/workspace',
    method: 'get'
  });
}

export async function addWorkspaceApi(request: AxiosInstance, data: AddWorkspaceDto) {
  return request({
    url: '/api/workspace',
    method: 'post',
    data
  })
}

export async function updateWorkspaceApi(request: AxiosInstance, data: UpdateWorkspaceDto) {
  return request({
    url: '/api/workspace/' + data.id,
    method: 'put',
    data
  })
}

export async function deleteWorkspaceApi(request: AxiosInstance, id: number) {
  return request({
    url: '/api/workspace/' + id,
    method: 'delete',
  })
}