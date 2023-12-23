"use client"

import * as React from "react"

import {cn} from "@/lib/utils"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useTranslation} from "@/app/i18n/client";
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
      <form action={"/api/auth/sign-up"} method={"post"}>
        <div className="grid gap-2 mb-4">
          {search.get("error") &&
              <Alert variant="destructive" className={"grid gap-1"}>
                  <ExclamationTriangleIcon className="h-4 w-4"/>
                  <AlertTitle>{t("alertBanner.error")}</AlertTitle>
                  <AlertDescription>{search.get("error")}</AlertDescription>
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
        </div>
        <Button className={"w-full"}>
          {t("signUp.signUpButton")}
        </Button>
        <a href={"/account/login"}>
          <Button className={"w-full"} type={"button"} variant={"link"}>{t("signUp.haveAccount")}</Button>
        </a>
      </form>
    </div>
  )
}