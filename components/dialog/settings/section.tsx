import React from "react";

interface SettingsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

interface SettingsItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  title: string;
}

export function SettingsSection({children, title}: SettingsSectionProps) {
  return (
    <div className={"border-b py-6 first-of-type:pt-0 last-of-type:border-b-0 last-of-type:pb-0"}>
      <div className="text-lg font-semibold pb-4">{title}</div>
      <div>
        {children}
      </div>
    </div>
  )
}

export function SettingsItem({children, title, icon}: SettingsItemProps) {
  return (
    <div className={"flex justify-between"}>
      <div className={"flex items-center"}>
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}