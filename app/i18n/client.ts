'use client'

import {useEffect, useState} from 'react'
import i18next from 'i18next'
import {initReactI18next, useTranslation as useTranslationOrg} from 'react-i18next'
import {useCookies} from 'react-cookie'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import {cookieName, getOptions, languages} from './settings'
import {useParams} from "next/navigation";

const runsOnServerSide = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? languages : []
  }).then()

export function useTranslation(lng?: string, ns?: string) {
  const params = useParams();
  const chooseLng = lng === undefined ? params['lng'] as string : lng;
  const [cookies, setCookie] = useCookies([cookieName])
  const ret = useTranslationOrg(ns)
  const {i18n} = ret
  if (runsOnServerSide && chooseLng && i18n.resolvedLanguage !== chooseLng) {
    i18n.changeLanguage(chooseLng).then()
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!chooseLng || i18n.resolvedLanguage === chooseLng) return
      i18n.changeLanguage(chooseLng).then()
    }, [chooseLng, i18n])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (cookies[cookieName] === chooseLng) return
      setCookie(cookieName, chooseLng, {path: '/'})
    }, [cookies, chooseLng, setCookie])
  }
  return ret
}