import React from "react";
import {cn} from "@/lib/utils";

export interface TransparentButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
}

export default function TransparentButton({icon, className, onClick}: TransparentButtonProps) {
  return (
    <div className={cn("inline-block bg-black/30 p-2 rounded-xl", className)} onClick={onClick}>
      {icon}
    </div>
  )
}