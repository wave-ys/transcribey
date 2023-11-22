import {redirect} from "next/navigation";

interface MediaProps {
  params: {
    lng: string,
    workspace: string,
    category: string
  }
}

export default function MediaPage({params: {lng, workspace, category}}: MediaProps) {
  redirect(`/${lng}/dashboard/${workspace}/media/${category}/_`);
}