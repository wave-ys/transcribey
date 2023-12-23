"use client"

import * as React from "react"

import {cn} from "@/lib/utils"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useTranslation} from "@/app/i18n/client";
import {ImGithub} from "react-icons/im";
import {Checkbox} from "@/components/ui/checkbox";
import {useSearchParams} from "next/navigation";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function UserAuthForm({className, ...props}: UserAuthFormProps) {
  const {t} = useTranslation();
  const search = useSearchParams();

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form action={"/api/auth/log-in?useCookies=true"} method={"post"}>
        <div className="grid gap-2">
          {search.get("failed") === 'true' &&
              <Alert variant="destructive" className={"grid gap-1"}>
                  <ExclamationTriangleIcon className="h-4 w-4"/>
                  <AlertTitle>{t("alertBanner.error")}</AlertTitle>
                  <AlertDescription>{t("login.failed")}</AlertDescription>
              </Alert>
          }
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              {t("login.email")}
            </Label>
            <Input
              id="email"
              name={"email"}
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              {t("login.password")}
            </Label>
            <Input
              id="password"
              name={"password"}
              placeholder={t("login.password")}
              type="password"
            />
          </div>
          <div className="grid gap-1">
            <div className={"flex items-center space-x-1"}>
              <Checkbox
                id="rememberMe"
                name={"rememberMe"}
              />
              <Label htmlFor="rememberMe">
                {t("login.rememberMe")}
              </Label>
            </div>
          </div>
          <Button>
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
        <Button className={"w-full"} variant="outline" type="button">
          <ImGithub className="mr-2 h-4 w-4"/>
          Github
        </Button>
      </a>
    </div>
  )
}