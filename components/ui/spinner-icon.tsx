import {CgSpinner} from "react-icons/cg";
import {cn} from "@/lib/utils";

export default function SpinnerIcon({className}: { className: string }) {
  return <CgSpinner className={cn("animate-spin h-4 w-4", className)}/>
}