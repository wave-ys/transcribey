'use client';

import React, {createContext, useContext, useMemo} from "react";
import {WorkspaceModel} from "@/request/workspace";

export interface WorkspaceContextType {
  workspaces: WorkspaceModel[];
  currentWorkspace: WorkspaceModel | null;
}

export interface WorkspaceProviderProps {
  list: WorkspaceModel[];
  id: string;
  children: React.ReactNode;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaces: [],
  currentWorkspace: null
});

export function useWorkspace() {
  return useContext(WorkspaceContext);
}

export function WorkspaceProvider(props: WorkspaceProviderProps) {
  const current = useMemo(() => (
    props.list.find(w => w.id + "" === props.id)
  ), [props.id, props.list]);
  return (
    <WorkspaceContext.Provider value={{
      workspaces: props.list,
      currentWorkspace: current ?? null
    }}>
      {props.children}
    </WorkspaceContext.Provider>
  )
}