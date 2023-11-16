import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import React, {ReactNode} from "react";
import {IconBaseProps} from "react-icons";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
}

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

export interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean,
  icon?: ReactNode
}

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function SidebarSection({className, title, children}: SidebarSectionProps) {
  return (
    <div className="py-2">
      <h2 className={cn("mb-2 px-4 text-lg font-semibold tracking-tight", className)}>
        {title}
      </h2>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}

export function SidebarItem({className, children, active, icon}: SidebarItemProps) {
  return (
    <Button variant={active ? "secondary" : "ghost"} className={cn("w-full justify-start", className)}>
        {icon}
        {children}
    </Button>
  )
}

export function SidebarHeader({children, className}: SidebarHeaderProps) {
  return (
    <div className={cn("mb-2", className)}>{children}</div>
  )
}

export function Sidebar({className, children}: SidebarProps) {
  return (
    <div className={cn("pb-12 px-3", className)}>
      <div className="space-y-4 py-2">
        {children}
      </div>
    </div>
  )
}