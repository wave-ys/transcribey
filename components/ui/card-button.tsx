import React from "react";
import {cn} from "@/lib/utils";

export interface CardButtonProps {
  icon: React.ReactNode,
  title: string,
  subtitle: string
}

export default function CardButton({icon, title, subtitle}: CardButtonProps) {
  return (
    <div className={cn(
      "border w-72 h-28 rounded-xl font-medium cursor-pointer shadow-md",
      "hover:border-blue-600 transition duration-300 bg-white/10",
      "p-4 flex space-x-4"
    )}>
      <div className={"text-lg text-blue-600 pt-1"}>
        {icon}
      </div>
      <div className={"space-y-3"}>
        <div className={"text-lg"}>{title}</div>
        <div className={"text-gray-500"}>{subtitle}</div>
      </div>
    </div>
  )
}