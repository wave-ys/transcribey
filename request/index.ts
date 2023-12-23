import axios from "axios";
import * as process from "process";

export const request = axios.create({
  baseURL: process.env.API_PATH,
  withCredentials: true,
});

request.interceptors.request.use(async config => {
  if (typeof globalThis.window === 'undefined') {
    const {cookies} = await import("next/headers");
    config.headers["Cookie"] = cookies().toString();
  }
  return config;
})