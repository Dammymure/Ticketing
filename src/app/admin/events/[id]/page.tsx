'use client'
import db from "@/db/db";
import { PageHeader } from "../../_components/PageHeader";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParams } from "next/navigation";

const dummyData = [
    {
        email: "user1@example.com",
        createdAt: new Date("2023-01-01T10:00:00Z")
    },
    {
        email: "user2@example.com",
        createdAt: new Date("2023-02-01T11:00:00Z")
    },
    {
        email: "user3@example.com",
        createdAt: new Date("2023-03-01T12:00:00Z")
    },
    {
        email: "user4@example.com",
        createdAt: new Date("2023-04-01T13:00:00Z")
    },
    {
        email: "user5@example.com",
        createdAt: new Date("2023-05-01T14:00:00Z")
    }
];


export default async function EventInfo(){
    const { id } = useParams() as { id: any };

    const event = await db.event.findUnique({ where: { id }, 
        select:{
            title: true,
            date: true,
            imagePath: true,
            description: true,
            NumberOfTickets: true,
            TicketVerifications: true,
            isAvailableForPurchase: true,
            createdAt: true,
            pricePaidInCents: true,
            client: {select:{name:true}},
            users: {select:{
                email:true,
                createdAt:true,
            }},
            
        },
    });
    return <>
    <div className="flex justify-between items-center gap-4">
        <PageHeader >Event Info</PageHeader>   
        {/* <Button asChild>
            <Link href="/admin/events/new">Add Event</Link>
        </Button> */}
    </div>
        <div className="flex gap-4 mt-5">
            <div className="relative w-1/5 h-auto aspect-video">
                <Image src={event?.imagePath || "/default-image-path.jpg"} fill alt={event?.title || "Event Image"}/>
            </div>

            <div>
            <h1 className="text-4xl">{event?.title}</h1>
            <h1 className="text-xl text-gray-500">{event?.client.name}</h1>
            <h1 className="text-sm" >{event?.description}</h1>
            <h1 className="text-sm text-gray-500 font-medium" >{event?.createdAt?.toLocaleString()}</h1>
            <h1 className="text-sm" >{`${event?.NumberOfTickets ?? 0}/${event?.TicketVerifications?.length ?? 1}`}</h1>

            </div>
        </div>

        <div className="mt-5 w-2/3 flex justify-between items-center gap-4 mx-auto ">
            {
            dummyData.length === 0 ? (
                <p className="text-2xl">No users found</p>
            ) : 
            (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-300/10">
                            <TableHead>Email</TableHead>
                            <TableHead>Purchased at</TableHead>
                            <TableHead className="w-0">
                                <span className="sr-only">Actions</span>
                            </TableHead>            
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {dummyData.map(user => (
                        <TableRow key={user.email}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.createdAt.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}


                    </TableBody>


                    </Table>
                    // <div key={user.email}>
                    //     <h1>
                    //         {user.email}
                    //     </h1>
                    //     <p>
                    //         {user.createdAt.toLocaleString()}
                    //     </p>
                        
                    // </div>
            )}

        </div>

    </>
}