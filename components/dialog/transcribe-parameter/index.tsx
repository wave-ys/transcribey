"use client";

import * as z from "zod"
import {Dialog, DialogContent, DialogHeader,} from "@/components/ui/dialog"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {ComboBox, ComboBoxGroup} from "@/components/ui/combo-box";
import {DialogProps} from "@radix-ui/react-dialog";
import {useTranslation} from "@/app/i18n/client";
import {useMemo} from "react";

const formSchema = z.object({
  model: z.string().min(1),
  language: z.string().min(1),
  file: z.any()
})

export default function TranscribeParameterDialog(props: DialogProps) {
  const {t} = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "small",
      language: "auto",
      file: null
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const languages = useMemo(() => {
    const value = fakeLanguages;
    value[0].children[0].label = t("home.transcribeParameter.autoLanguage");
    return value;
  }, [t])

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="language"
              render={({field}) => (
                <FormItem>
                  <div className={"flex justify-between items-center"}>
                    <FormLabel>{t("home.transcribeParameter.language")}</FormLabel>
                    <FormControl>
                      <ComboBox className={"ml-auto"} options={languages} value={field.value}
                                onChange={field.onChange}/>
                    </FormControl>
                  </div>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({field}) => (
                <FormItem>
                  <div className={"flex justify-between items-center"}>
                    <FormLabel>{t("home.transcribeParameter.model")}</FormLabel>
                    <FormControl>
                      <ComboBox className={"ml-auto"} options={fakeModals} value={field.value}
                                onChange={field.onChange}/>
                    </FormControl>
                  </div>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className={"w-fit ml-auto space-x-2"}>
              <Button variant={"outline"} onClick={() => props.onOpenChange?.(false)}>
                {t("home.transcribeParameter.cancelButton")}
              </Button>
              <Button type="submit">
                {t("home.transcribeParameter.submitButton")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const fakeModals: ComboBoxGroup[] = [
  {
    label: "Multi Language",
    key: 'multi',
    children: [
      {
        label: "Small",
        value: "small"
      },
      {
        label: "Tiny",
        value: "tiny"
      }
    ]
  },
  {
    label: "Multi2 Language",
    key: 'multi2',
    children: [
      {
        label: "Small2",
        value: "small2"
      },
      {
        label: "Tiny2",
        value: "tiny2"
      }
    ]
  }
]

const fakeLanguages: ComboBoxGroup[] = [
  {
    key: 'lng',
    children: [
      {
        label: 'Auto',
        value: 'auto'
      },
      {
        label: 'English',
        value: 'en'
      }
    ]
  }
]