import {SettingsItem, SettingsSection} from "@/components/dialog/settings/section";
import {LuPalette} from "react-icons/lu";
import {useTheme} from "next-themes";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useParams, usePathname, useRouter} from "next/navigation";
import {languageEntities} from "@/app/i18n/settings";
import {useCallback} from "react";

export function GeneralSettings() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = useCallback((language: string) => {
    const items = pathname.split('/');
    items[1] = language;
    router.push(items.join('/'));
  }, [pathname, router]);

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
        <SettingsItem icon={<LuPalette className={"w-4 h-4 mr-2"}/>} title={"Change Languages"}>
          <Select value={params['lng'] as string} onValueChange={changeLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language"/>
            </SelectTrigger>
            <SelectContent>
              {languageEntities.map(language => (
                <SelectItem value={language.value} key={language.value}>{language.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsItem>
      </SettingsSection>
    </>
  )
}