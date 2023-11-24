import React from "react";
import {cn} from "@/lib/utils";

export interface TransparentButtonProps {
  className?: string,
  icon: React.ReactNode
}

export default function TransparentButton({icon, className}: TransparentButtonProps) {
  return (
    <div className={cn("inline-block bg-black/30 p-2 rounded-xl", className)}>
      {icon}
    </div>
  )
}