"use client"

import * as React from "react"
import {MoonIcon, SunIcon} from "@radix-ui/react-icons"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useTranslation} from "@/app/i18n/client";

export function ThemeToggle() {
  const {setTheme, theme} = useTheme()
  const {t} = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
          <MoonIcon
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme}>
          <DropdownMenuRadioItem value={"system"} onClick={() => setTheme("system")}>
            {t("settings.appearance.theme.system")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={"light"} onClick={() => setTheme("light")}>
            {t("settings.appearance.theme.light")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={"dark"} onClick={() => setTheme("dark")}>
            {t("settings.appearance.theme.dark")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
