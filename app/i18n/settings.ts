import {InitOptions} from "i18next";

export const fallbackLng = 'en'
export const languageEntities = [
  {
    title: 'English',
    value: 'en'
  },
  {
    title: '简体中文',
    value: 'zh-cn'
  }
]
export const languages = languageEntities.map(item => item.value)
export const defaultNS = 'common'
export const cookieName = 'i18n'

export function getOptions(lng = fallbackLng, ns = defaultNS): InitOptions {
  return {
    // debug: process.env.NODE_ENV === 'development',
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns: [ns, 'zod'],
    load: 'currentOnly',
    lowerCaseLng: true
  }
}