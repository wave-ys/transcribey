'use client';

import React, {createContext, useContext, useEffect, useState} from "react";
import SettingsDialog from "@/components/dialog/settings";

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
  const [state, setState] = useState<Omit<SettingsDialogContextType, "setState">>({
    open: false
  });

  useEffect(() => {
    if (sessionStorage.getItem('settings.reopen') === 'true') {
      setState(prev => ({...prev, open: true}));
      sessionStorage.removeItem('settings.reopen');
    }
  }, [])

  return (
    <SettingsDialogContext.Provider value={{
      ...state,
      setState
    }}>
      {children}
      <SettingsDialog/>
    </SettingsDialogContext.Provider>
  )
}