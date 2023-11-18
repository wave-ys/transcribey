import {createInstance} from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import {initReactI18next} from 'react-i18next/initReactI18next'
import {fallbackLng, getOptions} from './settings'
import {toUpperCaseLng} from "@/lib/utils";

const initI18next = async (lng?: string, ns?: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => {
      if (namespace === 'zod')
        return import(`zod-i18n-map/locales/${toUpperCaseLng(language)}/zod.json`)
      return import(`./locales/${language}/${namespace}.json`);
    }))
    .init(getOptions(lng, ns))
  return i18nInstance
}

export async function useTranslation(lng?: string, ns?: string) {
  const i18nextInstance = await initI18next(lng, ns)
  return {
    t: i18nextInstance.getFixedT(lng ?? fallbackLng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance
  }
}