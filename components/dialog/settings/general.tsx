import {SettingsItem, SettingsSection} from "@/components/dialog/settings/section";
import {LuLanguages, LuPalette} from "react-icons/lu";
import {useTheme} from "next-themes";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useParams, usePathname, useRouter} from "next/navigation";
import {languageEntities} from "@/app/i18n/settings";
import {useCallback} from "react";
import {useTranslation} from "@/app/i18n/client";

export function GeneralSettings() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const {t} = useTranslation();

  const changeLanguage = useCallback((language: string) => {
    const items = pathname.split('/');
    items[1] = language;
    router.push(items.join('/'));
  }, [pathname, router]);

  return (
    <>
      <SettingsSection title={t("settings.appearance.title")}>
        <SettingsItem icon={<LuPalette className={"w-4 h-4 mr-2"}/>} title={t("settings.appearance.theme.title")}>
          <Select value={theme.theme} onValueChange={theme.setTheme}>
            <SelectTrigger className="w-[180px]">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">{t("settings.appearance.theme.system")}</SelectItem>
              <SelectItem value="light">{t("settings.appearance.theme.light")}</SelectItem>
              <SelectItem value="dark">{t("settings.appearance.theme.dark")}</SelectItem>
            </SelectContent>
          </Select>
        </SettingsItem>
      </SettingsSection>
      <SettingsSection title={t("settings.language.title")}>
        <SettingsItem icon={<LuLanguages className={"w-4 h-4 mr-2"}/>} title={t("settings.language.change.title")}>
          <Select value={params['lng'] as string} onValueChange={changeLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue/>
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