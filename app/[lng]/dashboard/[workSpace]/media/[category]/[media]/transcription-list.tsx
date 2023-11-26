import {TranscriptionItem, TranscriptionModel} from "@/request/transcription";
import {cn, secondsToString} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {LuCopy, LuCopyCheck} from "react-icons/lu";
import {RefObject, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {MediaPlayerInstance, useMediaState} from "@vidstack/react";
import {TbArrowAutofitDown, TbTrash, TbTrashOff} from "react-icons/tb";
import {Toggle} from "@/components/ui/toggle";
import animateScrollTo from "animated-scroll-to";

export interface TranscriptionState extends TranscriptionItem {
  current: string;
  deleted: boolean;
}

export interface TranscriptionListProps {
  list: TranscriptionModel;
  playerRef?: RefObject<MediaPlayerInstance>;
  className?: string;
}

export interface TranscriptionItemProps {
  item: TranscriptionState;
  playerRef?: RefObject<MediaPlayerInstance>;
  onDeleteClick: (value: boolean) => void;
  onChange: (value: string) => void;
  parentRef?: RefObject<HTMLDivElement>;
  autoScroll: boolean;
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

export function TranscriptionItem(
  {
    item,
    playerRef,
    onDeleteClick,
    onChange,
    parentRef,
    autoScroll
  }: TranscriptionItemProps) {
  const [editing, setEditing] = useState(false);
  const [currentText, setCurrentText] = useState(item.current);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentTime = useMediaState("currentTime", playerRef);
  const playing = useMediaState("playing", playerRef);
  const isCurrent = useMemo(() => playing && item.start <= currentTime && item.end > currentTime, [currentTime, item.end, item.start, playing])
  const currentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isCurrent || !parentRef?.current || !currentRef.current || !autoScroll)
      return;

    const visible = parentRef.current.offsetTop + parentRef.current.clientTop + parentRef.current.scrollTop <= currentRef.current.offsetTop
      && parentRef.current.offsetTop + parentRef.current.clientTop + parentRef.current.scrollTop + parentRef.current.clientHeight >= currentRef.current.offsetTop + currentRef.current.offsetHeight
    if (!visible) {
      animateScrollTo(
        currentRef.current.offsetTop - parentRef.current.offsetTop - parentRef.current.clientTop,
        {
          elementToScroll: parentRef.current,
          speed: 20,
          cancelOnUserAction: true
        }
      ).then()
    }

  }, [autoScroll, isCurrent, parentRef]);

  useEffect(() => {
    if (!editing)
      return;
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(currentText.length, currentText.length)
  }, [currentText.length, editing]);

  return (
    <div className={"flex items-center space-x-4 group relative"} ref={currentRef}>
      <div className={"text-muted-foreground text-xs hover:text-blue-600 cursor-pointer"} onClick={() => {
        if (!playerRef?.current)
          return;
        playerRef.current.currentTime = item.start;
      }}>
        {secondsToString(item.start)}
      </div>
      <div className={cn(
        "p-2 border border-transparent rounded-xl flex-auto",
        item.deleted && "text-muted-foreground line-through",
        editing && "hidden",
        !item.deleted ? "cursor-pointer group-hover:border-blue-600" : "cursor-default",
        isCurrent && "bg-blue-600 text-white"
      )} onClick={() => {
        if (item.deleted)
          return;
        setEditing(true);
      }}>
        {item.current}
      </div>
      <input ref={inputRef}
             onBlur={() => {
               setEditing(false);
               onChange(currentText);
             }}
             onKeyUp={e => {
               if (e.key === 'Enter') {
                 setEditing(false);
                 onChange(currentText);
               }
             }}
             className={cn(
               "p-2 border rounded-xl border-blue-600 flex-auto focus-visible:outline-blue-800 dark:focus-visible:outline-blue-300",
               !editing && "hidden"
             )}
             value={currentText} onChange={e => setCurrentText(e.target.value)}/>
      <div className={"hidden group-hover:block absolute right-1"}>
        <CopyButton item={item}/>
        <Button variant={"ghost"} size={"icon"} onClick={() => onDeleteClick(!item.deleted)}>
          {item.deleted ? <TbTrashOff/> : <TbTrash/>}
        </Button>
      </div>
    </div>
  )
}

export default function TranscriptionList({list, playerRef, className}: TranscriptionListProps) {
  const [transcriptionStates, setTranscriptionStates] = useState<TranscriptionState[]>(list.map(item => ({
    ...item,
    current: item.text,
    deleted: false
  })));

  const listRef = useRef<HTMLDivElement>(null);

  const handleDeleteItemClick = useCallback((index: number, value: boolean) => {
    const newStates = [...transcriptionStates];
    newStates[index] = {
      ...newStates[index],
      deleted: value
    };
    setTranscriptionStates(newStates);
  }, [transcriptionStates])

  const handleChangeItem = useCallback((index: number, value: string) => {
    const newStates = [...transcriptionStates];
    newStates[index] = {
      ...newStates[index],
      current: value
    };
    setTranscriptionStates(newStates);
  }, [transcriptionStates])

  const [autoScroll, setAutoScroll] = useState(false);

  if (!playerRef)
    return <></>

  return (
    <div className={cn(className)}>
      <div className={"mb-1 w-fit ml-auto flex-none"}>
        <Toggle variant={"solid"} pressed={autoScroll} onPressedChange={setAutoScroll}>
          <TbArrowAutofitDown/>
        </Toggle>
      </div>
      <div className={"space-y-1 overflow-y-auto flex-grow"} ref={listRef}>
        {transcriptionStates.map((item, index) => (
          <TranscriptionItem
            autoScroll={autoScroll}
            parentRef={listRef}
            onDeleteClick={v => handleDeleteItemClick(index, v)}
            onChange={v => handleChangeItem(index, v)}
            playerRef={playerRef} key={item.start}
            item={item}/>
        ))}
      </div>
    </div>
  )
}