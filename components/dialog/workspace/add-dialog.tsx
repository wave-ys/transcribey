import React, {useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {useTranslation} from "@/app/i18n/client";

import * as z from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import ColorPicker from "@/components/ui/color-picker";
import {randomColor} from "@/lib/utils";

export interface AddWorkspaceDialogProps {
  children: (setOpen: (v: boolean) => void) => React.ReactNode
}

export default function AddWorkspaceDialog({children}: AddWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();

  const formSchema = z.object({
    name: z.string().min(1),
    color: z.string()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {name: "", color: randomColor()}
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <>
      {children((v) => {
        form.reset();
        form.setValue("color", randomColor());
        setOpen(v);
      })}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("sidebar.createWorkspace.title")}</DialogTitle>
            <DialogDescription>
              {t("sidebar.createWorkspace.description")}
            </DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <div className={"flex space-x-2"}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                      <FormItem className={"flex-auto"}>
                        <FormControl>
                          <Input placeholder={t("sidebar.createWorkspace.namePlaceholder")}
                                 {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"color"}
                    render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <ColorPicker className={"mt-1.5"} value={field.value} onChange={field.onChange}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button className={"w-full"} type="submit">{t("sidebar.createWorkspace.submitButton")}</Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}