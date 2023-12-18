'use client';

import {formatDistance} from "date-fns";
import {format, utcToZonedTime} from "date-fns-tz";
import getDateFnsLocale from "@/app/i18n/date";
import {useEffect, useState} from "react";

// TODO: Test whether this really works in docker with different timezones
export function TimeDistance(props: { lng: string, date: string }) {
  const [str, setStr] = useState("")

  useEffect(() => {
    setStr(formatDistance(
      utcToZonedTime(props.date, Intl.DateTimeFormat().resolvedOptions().timeZone),
      new Date(),
      {
        addSuffix: true,
        locale: getDateFnsLocale(props.lng)
      }))
  }, [props.date, props.lng])

  return (
    <span>
      {str}
    </span>
  )
}

export function TimeFormat(props: { lng: string, date: string }) {
  const [str, setStr] = useState("")

  useEffect(() => {
    setStr(format(
      utcToZonedTime(props.date, Intl.DateTimeFormat().resolvedOptions().timeZone),
      'yyyy-MM-dd HH:mm:ss'
    ));
  }, [props.date]);

  return (
    <span>
      {str}
    </span>
  )
}