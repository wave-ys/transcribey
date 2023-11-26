import {TranscriptionItem, TranscriptionModel} from "@/request/transcription";
import {secondsToString} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {LuCopy} from "react-icons/lu";
import {HiOutlineTrash} from "react-icons/hi";

export interface TranscriptionListProps {
  list: TranscriptionModel
}

export interface TranscriptionItemProps {
  item: TranscriptionItem
}

export function TranscriptionItem({item}: TranscriptionItemProps) {
  return (
    <div className={"flex items-center space-x-4 group relative"}>
      <div className={"text-muted-foreground text-xs hover:text-blue-600 cursor-pointer"}>
        {secondsToString(item.start)}
      </div>
      <div className={"p-2 border border-transparent rounded-xl hover:border-blue-600 cursor-pointer flex-auto"}>
        {item.text}
      </div>
      <div className={"hidden group-hover:block absolute right-1"}>
        <Button variant={"ghost"} size={"icon"}>
          <LuCopy/>
        </Button>
        <Button variant={"ghost"} size={"icon"}>
          <HiOutlineTrash/>
        </Button>
      </div>
    </div>
  )
}

export default function TranscriptionList({list}: TranscriptionListProps) {
  return (
    <div className={"space-y-1"}>
      {list.map(item => <TranscriptionItem key={item.start} item={item}/>)}
    </div>
  )
}