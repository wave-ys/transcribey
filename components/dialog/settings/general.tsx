import {SettingsItem, SettingsSection} from "@/components/dialog/settings/section";
import {LuPalette} from "react-icons/lu";
import {useTheme} from "next-themes";

export function GeneralSettings() {
  const theme = useTheme();

  return (
    <>
      <SettingsSection title={"Appearance"}>
        <SettingsItem icon={<LuPalette className={"w-4 h-4 mr-2"}/>} title={"Theme"}>
          Hello
        </SettingsItem>
      </SettingsSection>
      <SettingsSection title={"Language"}>
        language
      </SettingsSection>
    </>
  )
}