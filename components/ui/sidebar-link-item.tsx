"use client";

import React from "react";
import {SidebarItem, SidebarItemProps} from "@/components/ui/sidebar";
import {usePathname} from "next/navigation";
import {useSettingsDialog} from "@/components/provider/settings-dialog-provider";
import {FiSettings} from "react-icons/fi";

export interface SidebarLinkItemProps extends SidebarItemProps {
  href: string
}

export function SidebarLinkItem({href, ...other}: SidebarLinkItemProps) {
  const pathname = usePathname();

  return (
    <a href={href} className={"block"}>
      <SidebarItem {...other} active={pathname.startsWith(href)}/>
    </a>
  )
}

export function SidebarSettingsItem({children}: {
  children: React.ReactNode
}) {
  'use client';
  const settingsDialogContext = useSettingsDialog();
  return (
    <SidebarItem
      onClick={() => settingsDialogContext.setState({open: true})}
      icon={<FiSettings className={"w-4 h-4 mr-2"}/>}>
      {children}
    </SidebarItem>
  )
}