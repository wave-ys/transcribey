import * as dateFnsLocales from 'date-fns/locale';

export default function getDateFnsLocale(lng: string) {
  const locales = {
    'en': dateFnsLocales.enUS,
    'zh-cn': dateFnsLocales.zhCN
  }

  return locales[lng as keyof typeof locales];
}