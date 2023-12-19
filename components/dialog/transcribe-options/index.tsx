"use client";

import * as z from "zod"
import {Dialog, DialogContent, DialogHeader,} from "@/components/ui/dialog"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {ComboBox} from "@/components/ui/combo-box";
import {DialogProps} from "@radix-ui/react-dialog";
import {useTranslation} from "@/app/i18n/client";
import {useMemo} from "react";
import {TranscribeOptionsDto} from "@/request/media";
import TransmitProgressBar, {TransmitProgressState} from "@/components/ui/transmit-progress-bar";
import modelOptions from "@/components/dialog/transcribe-options/models";
import languageOptions from "@/components/dialog/transcribe-options/languages";

const formSchema = z.object({
  model: z.string().min(1),
  language: z.string().min(1),
})

export interface TranscribeOptionsDialogProps extends DialogProps {
  onSubmit?: (data: TranscribeOptionsDto) => void,
  progress?: TransmitProgressState
}

export default function TranscribeOptionsDialog(props: TranscribeOptionsDialogProps) {
  const {t} = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "tiny",
      language: "auto",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    props?.onSubmit?.(values);
  }

  const languages = useMemo(() => {
    const value = languageOptions;
    value[0].children[0].label = t("home.transcribeOptions.autoLanguage");
    return value;
  }, [t])

  return (
    <Dialog {...props}>
      <DialogContent hideClose={true}>
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
                                onChange={field.onChange} disabled={!!props.progress}/>
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
                      <ComboBox className={"ml-auto"} options={modelOptions} value={field.value}
                                onChange={field.onChange} disabled={!!props.progress}/>
                    </FormControl>
                  </div>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className={"flex justify-between space-x-12"}>
              <div className={"flex-auto"}>
                {props.progress && <TransmitProgressBar state={props.progress}/>}
              </div>
              <div className={"w-fit space-x-2"}>
                <Button type={"button"} variant={"outline"} disabled={!!props.progress}
                        onClick={() => props.onOpenChange?.(false)}>
                  {t("home.transcribeOptions.cancelButton")}
                </Button>
                <Button type="submit" disabled={!!props.progress}>
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
