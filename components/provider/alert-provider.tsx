"use client";

import React, {createContext, useCallback, useContext, useState} from "react";
import {useTranslation} from "@/app/i18n/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export interface AlertState {
  title?: string,
  description?: string,
}

export type AlertFun = (state?: AlertState) => Promise<boolean>

const AlertContext = createContext<AlertFun>(() => Promise.resolve(true));

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({children}: {
  children: React.ReactNode
}) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AlertState>({
    title: t("alert.defaultTitle")
  });
  const [executors, setExecutors] = useState<{
    res: (v: boolean) => void
  }>();

  const alertFun = useCallback((newState?: AlertState) => {
    setState({
      title: newState?.title ?? t("alert.defaultTitle"),
      description: newState?.description,
    });
    setOpen(true);
    return new Promise<boolean>((res) => setExecutors({res}));
  }, [t])

  return (
    <AlertContext.Provider value={alertFun}>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            {state.description &&
                <AlertDialogDescription>
                  {state.description}
                </AlertDialogDescription>
            }
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen(false);
                executors?.res(false)
              }}>{t("alert.defaultCancelButton")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpen(false);
                executors?.res(true)
              }}>{t("alert.defaultContinueButton")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </AlertContext.Provider>
  )
}