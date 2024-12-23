import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem, redirect } from "./_components/EventActions";
// import { redirect } from "next/navigation";
// import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";

export default function AdminEventPage(){
    return <>
    <div className="flex justify-between items-center gap-4">
        <PageHeader>Events</PageHeader>   
        <Button asChild>
            <Link href="/admin/events/new">Add Event</Link>
        </Button>
    </div>
    <EventTable/>
    </>
}

async function EventTable(){
    const events = await db.event.findMany({
        select:{
            id: true,
            title: true,
            pricePaidInCents: true,
            isAvailableForPurchase: true,
            date: true,
            clientId: true,
            client: {
                select:{
                    name: true,
                    email: true
                }
            },
            NumberOfTickets: true,
            _count: { select: 
                { users: true, 
                  TicketVerifications: true
                }}
        },
        orderBy: { createdAt: "asc"}
    })

    if(events.length === 0) return <p>No events found</p>
    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-0">
                    <span className="sr-only">Available for purchase</span>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Client email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Ticket Sales</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>            
            </TableRow>
        </TableHeader>
        <TableBody>
            {events.map(event => (
                <TableRow key={event.id}>
                    <TableCell>
                    {event.isAvailableForPurchase ? (
                        <>
                        <span className="sr-only">Available</span>
                            <CheckCircle2/>
                        </>
                    ):(
                        <>
                        <span className="sr-only">Unavailable</span>
                            <XCircle className="stroke-destructive"/>
                        </>
                    )}
                    </TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.client.name}</TableCell>
                    <TableCell>{event.client.email}</TableCell>
                    <TableCell>{event.date.toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(event.pricePaidInCents / 100)}</TableCell>
                    <TableCell>{formatNumber(event._count.users)} /{event.NumberOfTickets}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical/>
                                <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    
                                    <Link  href={`/admin/events/${event.id}`}>View</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a download href={`/admin/events/${event.id}/ticket`}>Download</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link  href={`/admin/events/${event.id}/edit`}>Edit</Link>
                                </DropdownMenuItem>
                                <ActiveToggleDropdownItem
                                id={event.id}
                                isAvailableForPurchase={event.isAvailableForPurchase}
                                />
                                <DropdownMenuSeparator/>
                                <DeleteDropdownItem
                                id={event.id}
                                disabled={event._count.users > 0}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}

        </TableBody>
    </Table>
}