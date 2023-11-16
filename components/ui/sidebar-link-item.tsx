"use client";

import Link from "next/link";
import React from "react";
import {SidebarItem, SidebarItemProps} from "@/components/ui/sidebar";
import {usePathname} from "next/navigation";

export interface SidebarLinkItemProps extends SidebarItemProps {
  href: string
}

export function SidebarLinkItem({href, ...other}: SidebarLinkItemProps) {
  const pathname = usePathname();

  return (
    <Link href={href}>
      <SidebarItem {...other} active={pathname.startsWith(href)}/>
    </Link>
  )
}