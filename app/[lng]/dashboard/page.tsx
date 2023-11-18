import {redirect} from "next/navigation";

interface DashboardProps {
  params: {
    lng: string
  }
}

export default function Dashboard({params: {lng}}: DashboardProps) {
  redirect(`/${lng}/dashboard/_`);
}