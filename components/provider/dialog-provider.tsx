'use client';

import React, {createContext, useContext, useState} from "react";
import SettingsDialog from "@/components/dialog/settings";
import {useCookies} from "react-cookie";

export interface SettingsDialogContextType {
  open: boolean,
  setState: (v: Omit<SettingsDialogContextType, "setState">) => void
}

const SettingsDialogContext = createContext<SettingsDialogContextType>({
  open: false,
  setState: () => {
  }
})

export function useSettingsDialog() {
  return useContext(SettingsDialogContext);
}

export function SettingsDialogProvider({children}: { children: React.ReactNode }) {
  const open = sessionStorage.getItem('settings.open')

  const [state, setState] = useState<Omit<SettingsDialogContextType, "setState">>({
    open: open === 'true'
  })

  return (
    <SettingsDialogContext.Provider value={{
      ...state,
      setState: (v) => {
        sessionStorage.setItem('settings.open', '' + v.open)
        setState(v);
      }
    }}>
      {children}
      <SettingsDialog/>
    </SettingsDialogContext.Provider>
  )
}