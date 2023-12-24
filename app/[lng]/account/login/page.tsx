import Image from "next/image"
import {UserAuthForm} from "@/app/[lng]/account/login/user-auth-form";
import {ThemeToggle} from "@/components/ui/theme-toggle";
import {useTranslation} from "@/app/i18n";
import {LanguageToggle} from "@/components/ui/language-toggle";

export interface LoginPageProps {
  params: {
    lng: string
  }
}

export default async function LoginPage({params: {lng}}: LoginPageProps) {
  const {t} = await useTranslation(lng);
  return (
    <div
      className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <span className={"absolute right-4 top-4 md:right-8 md:top-8 flex items-center space-x-2"}>
          <ThemeToggle/>
          <LanguageToggle/>
        </span>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900"/>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image className={"mr-2"} src={"/favicon.ico"} alt={"icon"} width={24} height={24}/>
          Transcribey
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("account.login.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("account.login.description")}
            </p>
          </div>
          <UserAuthForm/>
        </div>
      </div>
    </div>
  )
}