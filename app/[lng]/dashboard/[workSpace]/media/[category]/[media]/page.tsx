import React from "react";

interface MediaPageProps {
  params: {
    lng: string,
    workspace: string,
    category: string | 'all' | 'video' | 'audio' | 'details',
    media: string
  }
}

export default function MediaPage({params}: MediaPageProps) {
  return <>{params.media}</>
}