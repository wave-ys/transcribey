import {getMediaListApi} from "@/request/media";
import TrashTable from "@/app/[lng]/dashboard/[workspace]/trash/table";
import {isSidebarOpen} from "@/app/[lng]/dashboard/[workspace]/toggle-sidebar-button";

interface TrashPageProps {
  params: {
    lng: string,
    workspace: string,
  }
}

export default async function TrashPage({params}: TrashPageProps) {
  const {data} = await getMediaListApi(+params.workspace, "all", true);
  const sidebarOpen = isSidebarOpen();

  return (
    <TrashTable data={data} lng={params.lng} sidebarOpen={sidebarOpen}/>
  )
}