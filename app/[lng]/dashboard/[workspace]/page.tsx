import {redirect} from "next/navigation";

interface DashboardProps {
  params: {
    lng: string,
    workspace: string
  }
}

export default function DashboardPage({params: {lng, workspace}}: DashboardProps) {
  redirect(`/${lng}/dashboard/${workspace}/home`);
}