import {redirect} from "next/navigation";

interface DashboardProps {
  params: {
    lng: string,
    workSpace: string
  }
}

export default function DashboardPage({params: {lng, workSpace}}: DashboardProps) {
  redirect(`/${lng}/dashboard/${workSpace}/home`);
}