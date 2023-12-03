import {redirect} from "next/navigation";

interface MediaProps {
  params: {
    lng: string,
    workspace: string
  }
}

export default function DashboardPage({params: {lng, workspace}}: MediaProps) {
  redirect(`/${lng}/dashboard/${workspace}/media/all`);
}