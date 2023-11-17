import {Button} from "@/components/ui/button";
import {LuPanelLeftClose, LuPanelLeftOpen} from "react-icons/lu";
import React from "react";
import {cookies} from "next/headers";

export function isSidebarOpen() {
  return cookies().get("sidebar.open")?.value !== 'false';
}

export default function ToggleSidebarButton({className}: React.HTMLAttributes<HTMLDivElement>) {

  const sidebarOpen = isSidebarOpen();

  async function toggleSidebar() {
    'use server'
    cookies().set("sidebar.open", "" + !sidebarOpen);
  }

  return (
    <form action={toggleSidebar} className={className}>
      <Button variant={"ghost"} size={"icon"}>
        {
          sidebarOpen ? <LuPanelLeftClose className={"w-4 h-4"}/> : <LuPanelLeftOpen className={"w-4 h-4"}/>
        }
      </Button>
    </form>
  )
}