import {TranscriptionItem, TranscriptionModel} from "@/request/transcription";
import {cn, secondsToString} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {LuCopy, LuCopyCheck} from "react-icons/lu";
import {RefObject, useCallback, useState} from "react";
import {MediaPlayerInstance} from "@vidstack/react";
import {TbTrash, TbTrashOff} from "react-icons/tb";

export interface TranscriptionState extends TranscriptionItem {
  current: string;
  deleted: boolean;
}

export interface TranscriptionListProps {
  list: TranscriptionModel;
  playerRef?: RefObject<MediaPlayerInstance>;
}

export interface TranscriptionItemProps {
  item: TranscriptionState;
  playerRef?: RefObject<MediaPlayerInstance>;
  onDeleteClick: (value: boolean) => void;
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

export function TranscriptionItem({item, playerRef, onDeleteClick}: TranscriptionItemProps) {
  return (
    <div className={"flex items-center space-x-4 group relative"}>
      <div className={"text-muted-foreground text-xs hover:text-blue-600 cursor-pointer"} onClick={() => {
        if (!playerRef?.current)
          return;
        playerRef.current.currentTime = item.start;
      }}>
        {secondsToString(item.start)}
      </div>
      <div className={cn(
        "p-2 border border-transparent rounded-xl group-hover:border-blue-600 cursor-pointer flex-auto",
        item.deleted && "text-muted-foreground line-through"
      )}>
        {item.text}
      </div>
      <div className={"hidden group-hover:block absolute right-1"}>
        <CopyButton item={item}/>
        <Button variant={"ghost"} size={"icon"} onClick={() => onDeleteClick(!item.deleted)}>
          {item.deleted ? <TbTrashOff/> : <TbTrash/>}
        </Button>
      </div>
    </div>
  )
}

export default function TranscriptionList({list, playerRef}: TranscriptionListProps) {
  const [transcriptionStates, setTranscriptionStates] = useState<TranscriptionState[]>(list.map(item => ({
    ...item,
    current: "",
    deleted: false
  })));

  const handleDeleteItemClick = useCallback((index: number, value: boolean) => {
    const newStates = [...transcriptionStates];
    newStates[index] = {
      ...newStates[index],
      deleted: value
    };
    setTranscriptionStates(newStates);
  }, [transcriptionStates])

  return (
    <div className={"space-y-1"}>
      {transcriptionStates.map((item, index) => (
        <TranscriptionItem
          onDeleteClick={v => handleDeleteItemClick(index, v)}
          playerRef={playerRef} key={item.start}
          item={item}/>
      ))}
    </div>
  )
}