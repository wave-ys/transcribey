import {request} from "@/request/index";

export interface UserInfoDto {
  email: string;
  isEmailConfirmed: string;
}

export async function supplementEmailApi(email: string) {
  try {
    await request({
      method: 'post',
      url: '/api/auth/external-login-callback',
      data: {
        email
      }
    });
  } catch (e) {
    return false;
  }
  return true;
}

export async function getUserInfoApi() {
  return await request<UserInfoDto>({
    method: 'get',
    url: '/api/auth/manage/info'
  });
}