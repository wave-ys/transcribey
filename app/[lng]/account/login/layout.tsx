import {getUserInfoApi, UserInfoDto} from "@/request/auth";
import React from "react";
import {redirect} from "next/navigation";

export default async function LoginLayout({children}: { children: React.ReactNode }) {
  let userInfo: UserInfoDto | undefined = undefined;
  try {
    const {data} = await getUserInfoApi();
    userInfo = data;
  } catch (e) {
    return <>{children}</>
  }
  if (userInfo)
    redirect('/dashboard');
  return <>{children}</>
}