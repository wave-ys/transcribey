import {redirect} from "next/navigation";

interface HomeProps {
  params: {
    lng: string,
    workspace: string
  }
}

export default function DashboardPage({params: {lng, workspace}}: HomeProps) {
  redirect(`/${lng}/dashboard/${workspace}/home/all`);
}