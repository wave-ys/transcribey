"use client"

import {useForm} from "react-hook-form"
import * as z from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useTranslation} from "@/app/i18n/client";
import {supplementEmailApi} from "@/request/auth";
import {redirect, useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email(),
})

export default function SupplementEmailPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const {t} = useTranslation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (await supplementEmailApi(values.email))
      router.replace("/");
    else
      router.replace("/account/login")
  }

  return (
    <div className={"flex h-full w-full justify-center items-center"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t("login.email")}</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  {t("login.supplementEmail.description")}
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit">{t("login.supplementEmail.submit")}</Button>
        </form>
      </Form>
    </div>
  )
}
