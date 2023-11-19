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
import {TranscribeOptionsDto} from "@/request/transcribe";

const formSchema = z.object({
  model: z.string().min(1),
  language: z.string().min(1),
})

export interface TranscribeOptionsDialogProps extends DialogProps {
  onSubmit?: (data: TranscribeOptionsDto) => void,
  progress?: {
    show: boolean,
    progress: number,
    rate: number
  }
}

export default function TranscribeOptionsDialog(props: TranscribeOptionsDialogProps) {
  const {t} = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "small",
      language: "auto",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    props?.onSubmit?.(values);
  }

  const languages = useMemo(() => {
    const value = fakeLanguages;
    value[0].children[0].label = t("home.transcribeOptions.autoLanguage");
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
                    <FormLabel>{t("home.transcribeOptions.language")}</FormLabel>
                    <FormControl>
                      <ComboBox className={"ml-auto"} options={languages} value={field.value}
                                onChange={field.onChange} disabled={props.progress?.show}/>
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
                    <FormLabel>{t("home.transcribeOptions.model")}</FormLabel>
                    <FormControl>
                      <ComboBox className={"ml-auto"} options={fakeModals} value={field.value}
                                onChange={field.onChange} disabled={props.progress?.show}/>
                    </FormControl>
                  </div>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className={"flex justify-between"}>
              <div>{props.progress?.show && `${(props.progress.progress * 100).toFixed(2)}%`}</div>
              <div className={"w-fit space-x-2"}>
                <Button type={"button"} variant={"outline"} disabled={props.progress?.show}
                        onClick={() => props.onOpenChange?.(false)}>
                  {t("home.transcribeOptions.cancelButton")}
                </Button>
                <Button type="submit" disabled={props.progress?.show}>
                  {t("home.transcribeOptions.submitButton")}
                </Button>
              </div>
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