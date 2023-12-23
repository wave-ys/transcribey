"use client"

import * as React from "react"

import {cn} from "@/lib/utils"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useTranslation} from "@/app/i18n/client";
import SpinnerIcon from "@/components/ui/spinner-icon";
import {ImGithub} from "react-icons/im";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function UserAuthForm({className, ...props}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const {t} = useTranslation()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              {t("login.email")}
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              {t("login.password")}
            </Label>
            <Input
              id="password"
              placeholder={t("login.password")}
              type="password"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <SpinnerIcon className="mr-2"/>
            )}
            {t("login.signInButton")}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"/>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("login.orContinueWith")}
          </span>
        </div>
      </div>
      <a href={"/api/auth/external-login?provider=github"}>
        <Button className={"w-full"} variant="outline" type="button" disabled={isLoading}>
          <ImGithub className="mr-2 h-4 w-4"/>
          Github
        </Button>
      </a>
    </div>
  )
}