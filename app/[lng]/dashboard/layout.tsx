import React from "react";
import {getUserInfoApi} from "@/request/auth";
import {redirect} from "next/navigation";

export default async function DashboardRootLayout({children}: { children: React.ReactNode }) {
  try {
    await getUserInfoApi();
  } catch (e) {
    redirect('/account/login');
  }

  return <>{children}</>
}