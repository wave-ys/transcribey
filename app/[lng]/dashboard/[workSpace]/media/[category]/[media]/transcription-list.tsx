import {TranscriptionItem, TranscriptionModel} from "@/request/transcription";
import {secondsToString} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {LuCopy, LuCopyCheck} from "react-icons/lu";
import {HiOutlineTrash} from "react-icons/hi";
import {RefObject, useCallback, useState} from "react";
import {MediaPlayerInstance} from "@vidstack/react";

export interface TranscriptionListProps {
  list: TranscriptionModel;
  playerRef?: RefObject<MediaPlayerInstance>;
}

export interface TranscriptionItemProps {
  item: TranscriptionItem;
  playerRef?: RefObject<MediaPlayerInstance>;
}

export function CopyButton({item}: { item: TranscriptionItem }) {
  const [copied, setCopied] = useState(false);
  const [timeoutState, setTimeoutState] = useState<NodeJS.Timeout>();
  const handleClick = useCallback(async () => {
    await navigator.clipboard.writeText(item.text)
    setCopied(true);
    if (timeoutState !== undefined)
      clearTimeout(timeoutState);
    setTimeoutState(
      setTimeout(() => {
        setCopied(false);
      }, 800)
    );
  }, [item.text, timeoutState])

  return (
    <Button variant={"ghost"} size={"icon"} onClick={handleClick}>
      {copied ? <LuCopyCheck/> : <LuCopy/>}
    </Button>
  )
}

export function TranscriptionItem({item, playerRef}: TranscriptionItemProps) {
  return (
    <div className={"flex items-center space-x-4 group relative"}>
      <div className={"text-muted-foreground text-xs hover:text-blue-600 cursor-pointer"} onClick={() => {
        if (!playerRef?.current)
          return;
        playerRef.current.currentTime = item.start;
      }}>
        {secondsToString(item.start)}
      </div>
      <div className={"p-2 border border-transparent rounded-xl hover:border-blue-600 cursor-pointer flex-auto"}>
        {item.text}
      </div>
      <div className={"hidden group-hover:block absolute right-1"}>
        <CopyButton item={item}/>
        <Button variant={"ghost"} size={"icon"}>
          <HiOutlineTrash/>
        </Button>
      </div>
    </div>
  )
}

export default function TranscriptionList({list, playerRef}: TranscriptionListProps) {
  return (
    <div className={"space-y-1"}>
      {list.map(item => <TranscriptionItem playerRef={playerRef} key={item.start} item={item}/>)}
    </div>
  )
}