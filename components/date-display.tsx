'use client';

import {formatDistance} from "date-fns";
import {utcToZonedTime} from "date-fns-tz";
import getDateFnsLocale from "@/app/i18n/date";

// TODO: Test whether this really works in docker with different timezones
export function TimeDistance(props: { lng: string, date: string }) {
  return (
    <span suppressHydrationWarning>
      {formatDistance(
        utcToZonedTime(props.date, Intl.DateTimeFormat().resolvedOptions().timeZone),
        new Date(),
        {
          addSuffix: true,
          locale: getDateFnsLocale(props.lng)
        })}
    </span>
  )
}