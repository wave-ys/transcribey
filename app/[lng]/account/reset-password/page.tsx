"use client"

import {useForm} from "react-hook-form"
import * as z from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useTranslation} from "@/app/i18n/client";
import {resetPasswordApi} from "@/request/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/components/ui/use-toast";
import {useSearchParams} from "next/navigation";

export default function ResetPasswordPage() {
  const {toast} = useToast();
  const search = useSearchParams();
  const {t} = useTranslation();

  const formSchema = z.object({
    code: z.string(),
    email: z.string().email(),
    password: z.string().min(1),
    confirmPassword: z.string().min(1)
  }).refine(data => data.password === data.confirmPassword, {
    message: t("account.resetPassword.notMatchError"),
    path: ["confirmPassword"]
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: search.get('email') ?? "",
      code: search.get('code') ?? "",
      password: "",
      confirmPassword: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await resetPasswordApi(values.email, values.code, values.password);
    toast({
      title: t("account.resetPassword.toast"),
      duration: 3000
    })
    location.href = '/account/login';
  }

  return (
    <div className={"flex flex-col h-full w-full justify-center items-center space-y-4"}>
      <h1>{t("account.resetPassword.title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 min-w-[32rem]">
          <FormField
            control={form.control}
            name="code"
            render={({field}) => (
              <FormItem hidden>
                <FormControl>
                  <Input readOnly {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t("account.forgetPassword.emailLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} disabled/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t("account.resetPassword.passwordLabel")}</FormLabel>
                <FormControl>
                  <Input type={"password"} placeholder={t("account.resetPassword.passwordLabel")} {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t("account.resetPassword.confirmPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input type={"password"} placeholder={t("account.resetPassword.confirmPasswordLabel")} {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit">{t("account.login.supplementEmail.submit")}</Button>
        </form>
      </Form>
    </div>
  )
}
