import {redirect} from "next/navigation";
import {getWorkspaceListApi} from "@/request/workspace";
import {cookies} from "next/headers";

interface DashboardProps {
  params: {
    lng: string
  }
}

export default async function Dashboard({params: {lng}}: DashboardProps) {
  const {data: workspaces} = await getWorkspaceListApi();
  const recent = cookies().get('workspace.recent')?.value;
  if (workspaces.length === 0)
    redirect(`/${lng}/dashboard/_`);
  else if (!recent || workspaces.findIndex(w => w.id + "" === recent) === -1)
    redirect(`/${lng}/dashboard/${workspaces[0].id}`)
  else
    redirect(`/${lng}/dashboard/${recent}`)
}