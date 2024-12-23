"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { deleteEvent, toggleEventAvailability } from "../../_actions/event"

export function ActiveToggleDropdownItem({
    id, isAvailableForPurchase}
    : {id: string, isAvailableForPurchase: boolean
    }){
        const [isPending, startTransition] = useTransition()
        const router = useRouter()
        return <DropdownMenuItem 
        disabled={isPending}
        onClick={() => {
            startTransition(async () => {
                await toggleEventAvailability(id, !isAvailableForPurchase)
                router.refresh()
            })
        }}>
            {isAvailableForPurchase ? "Deactivate" : "Activate"}
        </DropdownMenuItem>

}

export function DeleteDropdownItem({
    id, disabled}
    : {id: string, disabled: boolean

    }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
        return (<DropdownMenuItem 
        disabled={disabled || isPending}
        onClick={() => {
            startTransition(async () => {
                await deleteEvent(id)
                router.refresh()
            })
        }} className="text-destructive hover:bg-red-500 hover:text-white">
            Delete
        </DropdownMenuItem>)
}

export function redirect(path: string){
    const router = useRouter()
    router.push(path)
}