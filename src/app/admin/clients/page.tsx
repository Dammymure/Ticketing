import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import db from "@/db/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ActiveToggleDropdownItem } from "../events/_components/EventActions";
import Link from "next/link";

export default function ClientPage(){
    return <>
    <div className="flex justify-between items-center gap-4">
        <PageHeader>Clients</PageHeader>   
        <Button asChild>
            {/* <Link href="/admin/events/new">Add Event</Link> */}
        </Button>
    </div>
    <ClientTable/>
    </>
}

async function ClientTable(){
    const clients = await db.client.findMany({
        select:{
            id: true,
            email:true,
             events: {
                select: {
                    title: true,
                    TicketVerifications: true,
                    NumberOfTickets: true,
                }
             },
             name: true,
            _count: { select: 
                { events: true
                }},
        },
        orderBy: { name: "asc"}
    })

    if(clients?.length === 0) return <p>No clients found</p>
    return <Table>
        <TableHeader>
            <TableRow>
                {/* <TableHead className="w-0">
                    <span className="sr-only">Available for purchase</span>
                </TableHead> */}
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>No. of Events</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>            
            </TableRow>
        </TableHeader>
        <TableBody>
            {clients.map(client => (
                <TableRow key={client.id}>

                    {/* <TableCell >
                    {client.isAvailableForPurchase ? (
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
                    </TableCell> */}
                    <TableCell>{client.id.substring(0, 8) + "..."}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{formatNumber(client._count.events)}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical/>
                                <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link  href={`/admin/clients/${client.id}/edit`}>Edit</Link>
                                </DropdownMenuItem>
                                {/* <ActiveToggleDropdownItem
                                id={client.id}
                                /> */}
                                <DropdownMenuSeparator/>
                                {/* <DeleteDropdownItem
                                id={client.id}
                                /> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}

        </TableBody>
    </Table>
}