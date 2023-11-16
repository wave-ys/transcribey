import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import React, {ReactNode} from "react";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: ReactNode
}

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

export interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean,
  icon?: ReactNode
}

export function SidebarSection({className, title, children}: SidebarSectionProps) {
  return (
    <div className={cn(title !== undefined && "py-2")}>
      {
        title !== undefined &&
          <h2 className={cn("mb-2 px-4 text-lg font-semibold tracking-tight", className)}>
            {title}
          </h2>
      }
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

export function Sidebar({className, children, header}: SidebarProps) {
  return (
    <div className={cn("pb-12 px-3", className)}>
      {header && <div className={"my-4"}>{header}</div>}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}