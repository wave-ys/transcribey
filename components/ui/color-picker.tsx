import {Sketch} from "@uiw/react-color";
import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";

export interface ColorPickerProps {
  value: string,
  onChange: (v: string) => void,
  className?: string
}

export default function ColorPicker({value, onChange, className}: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div style={{backgroundColor: value}} className={cn("w-6 h-6 rounded-full cursor-pointer", className)}></div>
      </PopoverTrigger>
      <PopoverContent className={"p-0"} asChild>
        <Sketch disableAlpha color={value} onChange={color => onChange(color.hex)}/>
      </PopoverContent>
    </Popover>
  )
}