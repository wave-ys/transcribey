import {SettingsItem, SettingsSection} from "@/components/dialog/settings/section";
import {LuPalette} from "react-icons/lu";
import {useTheme} from "next-themes";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export function GeneralSettings() {
  const theme = useTheme();

  return (
    <>
      <SettingsSection title={"Appearance"}>
        <SettingsItem icon={<LuPalette className={"w-4 h-4 mr-2"}/>} title={"Theme"}>
          <Select value={theme.theme} onValueChange={theme.setTheme}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </SettingsItem>
      </SettingsSection>
      <SettingsSection title={"Language"}>
        language
      </SettingsSection>
    </>
  )
}