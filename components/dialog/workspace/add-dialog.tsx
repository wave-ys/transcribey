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
import {useRouter} from "next/navigation";
import {addWorkspaceApi} from "@/request/workspace";

export interface AddWorkspaceDialogProps {
  children: (setOpen: (v: boolean) => void) => React.ReactNode
}

export default function AddWorkspaceDialog({children}: AddWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {t} = useTranslation();

  const formSchema = z.object({
    label: z.string().min(1),
    color: z.string()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {label: "", color: randomColor()}
  })

  const action = async () => {
    if (!await form.trigger())
      return;
    const values = form.getValues();
    await addWorkspaceApi(values);
    router.refresh();
    setOpen(false);
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
              <form action={action} className="space-y-2">
                <div className={"flex space-x-2"}>
                  <FormField
                    control={form.control}
                    name="label"
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