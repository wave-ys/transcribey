"use client"

import * as React from "react"
import {useMemo} from "react"

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
import {FaCircleCheck} from "react-icons/fa6";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function UserAuthForm({className, ...props}: UserAuthFormProps) {
  const {t} = useTranslation();
  const search = useSearchParams();

  const error = useMemo(() => {
    if (search.get("failed") !== 'true')
      return '';
    if (search.get("not_allowed") === 'true')
      return t('account.login.notAllowed');
    if (search.get("locked") === 'true')
      return t('account.login.locked');
    return t('account.login.failed');
  }, [search, t])

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form action={"/api/auth/log-in"} method={"post"}>
        <div className="grid gap-2">
          {search.get("failed") === 'true' &&
              <Alert variant="destructive" className={"grid gap-1"}>
                  <ExclamationTriangleIcon className="h-4 w-4"/>
                  <AlertTitle>{t("alertBanner.error")}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
          }
          {search.get("registered") === 'true' &&
              <Alert className={"grid gap-1"}>
                  <FaCircleCheck className="h-4 w-4"/>
                  <AlertTitle>{t("alertBanner.message")}</AlertTitle>
                  <AlertDescription>{t("account.login.registered")}</AlertDescription>
              </Alert>
          }
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              {t("account.login.email")}
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
              {t("account.login.password")}
            </Label>
            <Input
              id="password"
              name={"password"}
              placeholder={t("account.login.password")}
              type="password"
            />
          </div>
          <div className="grid gap-1">
            <div className={"flex justify-between"}>
              <div className={"flex items-center space-x-1"}>
                <Checkbox
                  id="rememberMe"
                  name={"rememberMe"}
                />
                <Label htmlFor="rememberMe">
                  {t("account.login.rememberMe")}
                </Label>
              </div>
              <a href={'/account/forget-password'}><Button type={"button"}
                                                           variant={"link"}>{t("account.login.forgetPassword")}</Button></a>
            </div>
          </div>
          <Button>
            {t("account.login.signInButton")}
          </Button>
          <a href={"/account/register"}>
            <Button className={"w-full"} variant={"outline"} type={"button"}>
              {t("account.login.signUpButton")}
            </Button>
          </a>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"/>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("account.login.orContinueWith")}
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