import {request} from "@/request/index";

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