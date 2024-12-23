"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatters"
import { useActionState, useState } from "react"
// import { addProduct, updateProduct } from "../../_actions/products"
import { useFormStatus } from "react-dom"
import { Event } from "@prisma/client"
import Image from "next/image"
import { addEvent, getClientData, updateEvent } from "../../_actions/event"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

export function EventForm({ event }: { event?: Event | null}){
    const [error, action] = useActionState(event == null ? addEvent : updateEvent.bind(null, event.id), {})
    const [priceInCents, setPriceInCents] = useState<number | undefined>(
        event?.pricePaidInCents !== undefined && !isNaN(event.pricePaidInCents) ? event.pricePaidInCents : undefined
      );    
    const [date, setDate] = React.useState<string>(event?.date ? new Date(event.date).toISOString().split('T')[0] : '');

    const [client, setClient] = React.useState<{ id: string; name: string; email: string } | null>(null);

    React.useEffect(() => {
        if (event?.clientId) {
            getClientData(event.clientId).then(setClient);
        }
    }, [event?.clientId]);

    return (
    <form action={action} className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input type="text" id="title" 
            name="title" 
            required
            defaultValue={event?.title || ""}/>
            {error?.title && <div className="text-destructive">{error.title}</div>}
        </div>
        <><div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
            <Input type="text" id="clientName"
                        name="clientName"
                        required 
                        defaultValue={client?.name || ""}
                        />
                    {error?.clientName && <div className="text-destructive">{error.clientName}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input type="email" id="clientEmail"
                            name="clientEmail"
                            defaultValue={client?.email || ""}
                            required />
                        {error?.clientEmail && <div className="text-destructive">{error.clientEmail}</div>}
                </div>
                    </>
        

<Popover>
    <PopoverTrigger asChild>
        <Button
            variant={"outline"}
            className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
            )}
        >
            <CalendarIcon />
            {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
        </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
        <Calendar
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={(day) => setDate(day ? day.toISOString().split('T')[0] : '')}
            initialFocus
        />
    </PopoverContent>
</Popover>
<Input type="hidden" name="date" value={date} />

        <div className="space-y-2">
            <Label htmlFor="pricePaidInCents">Price In Cents</Label>
            <Input 
                type="number" 
                id="pricePaidInCents" 
                name="pricePaidInCents" 
                required 
                value={priceInCents} 
                onChange={e => setPriceInCents(Number(e.target.value) || 0)}
            />
            <div className="text-muted-foreground">
                {formatCurrency((priceInCents || 0) / 100)}
            </div> 
            {error?.pricePaidInCents && <div className="text-destructive">{error.pricePaidInCents}</div>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="NumberOfTickets">Number of Available tickets</Label>
            <Input 
                id="NumberOfTickets" 
                type="number"
                name="NumberOfTickets" 
                required
                defaultValue={event?.NumberOfTickets || ""}
            />
            {error?.NumberOfTickets && <div className="text-destructive">{error.NumberOfTickets}</div>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
            id="description" 
            name="description" 
            required
            defaultValue={event?.description || ""}
            />
            {error?.description && <div className="text-destructive">{error.description}</div>}

        </div>

        <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required={event == null}/>
            {event != null && (
                <Image
                src={event?.imagePath}
                height={400}
                width={400}
                alt="Product Image"
                />
            )}
            {error?.image && <div className="text-destructive">{error.image}</div>}
        </div>

        <SubmitButton/>
    </form>)
}

function SubmitButton(){
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
        </Button>
    )
}

// title: data.title,
// date: data.date,
// pricePaidInCents: data.pricePaidInCents,
// clientId: client.id,
// NumberOfTickets: data.NumberOfTickets,
// imagePath,
// description: data.description,