import {WorkspaceModel} from "@/request/workspace";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import ColorPicker from "@/components/ui/color-picker";
import {Button} from "@/components/ui/button";
import React, {useEffect} from "react";
import {useTranslation} from "@/app/i18n/client";

export interface ManagePageProps {
  workspace: WorkspaceModel,
  onDirtyChange?: (dirty: boolean) => void
}

export default function ManagePage({workspace, onDirtyChange}: ManagePageProps) {
  const {t} = useTranslation();

  const formSchema = z.object({
    id: z.number(),
    label: z.string().min(1),
    color: z.string()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {label: workspace.label, color: workspace.color, id: workspace.id}
  })

  useEffect(() => onDirtyChange?.(form.formState.isDirty), [form.formState.isDirty, onDirtyChange]);

  return (
    <Form {...form}>
      <form className="space-y-2">
        <div className={"flex space-x-2"}>
          <FormField
            control={form.control}
            name="label"
            render={({field}) => (
              <FormItem className={"flex-auto"}>
                <FormControl>
                  <Input placeholder={t("sidebar.workspaceManagement.namePlaceholder")}
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
        <div className={"w-fit space-x-2 ml-auto"}>
          {form.formState.isDirty &&
              <Button type="submit">{t("sidebar.workspaceManagement.submitButton")}</Button>}
          <Button variant={"destructive"}>{t("sidebar.workspaceManagement.removeButton")}</Button>
        </div>
      </form>
    </Form>
  )
}