"use client"

import * as React from "react"
import {useCallback} from "react"

import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {LuLanguages} from "react-icons/lu";
import {useParams, usePathname} from "next/navigation";
import {languageEntities} from "@/app/i18n/settings";

export function LanguageToggle() {
  const params = useParams();
  const pathname = usePathname();

  const getLink = useCallback((lng: string) => {
    const splits = pathname.split('/');
    if (splits.length < 2)
      return;
    splits[1] = lng;
    return splits.join('/');
  }, [pathname])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <LuLanguages className="h-[1.2rem] w-[1.2rem]"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={params['lng'] as string}>
          {languageEntities.map(language => (
            <a href={getLink(language.value)} key={language.value}>
              <DropdownMenuRadioItem value={language.value}>{language.title}</DropdownMenuRadioItem>
            </a>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
