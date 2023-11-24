import {getMediaListApi} from "@/request/media";
import {useTranslation} from "@/app/i18n";
import TrashTable from "@/app/[lng]/dashboard/[workspace]/trash/table";

interface TrashPageProps {
  params: {
    lng: string,
    workspace: string,
  }
}

export default async function TrashPage({params}: TrashPageProps) {
  const {t} = await useTranslation(params.lng)
  const {data} = await getMediaListApi(+params.workspace, "all", true);


  return (
    <TrashTable data={data} lng={params.lng}/>
  )
}