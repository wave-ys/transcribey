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

export async function resetPasswordApi(email: string) {
  const form = new FormData();
  form.append("email", email);

  await request({
    method: 'post',
    url: '/api/auth/send-password-reset-link',
    data: form
  })
}

export async function logOutApi() {
  await request({
    method: 'post',
    url: '/api/auth/log-out'
  });
}

export async function getUserInfoApi() {
  return await request<UserInfoDto>({
    method: 'get',
    url: '/api/auth/info'
  });
}