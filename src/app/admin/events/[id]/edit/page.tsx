import { PageHeader } from "../../../_components/PageHeader";
import { EventForm } from "../../_components/EventForm";
import db from "@/db/db";

// interface PageProps {
//     params: Promise<{ id: string }> & {
//         then: Promise<{ id: string }>['then'];
//         catch: Promise<{ id: string }>['catch'];
//         finally: Promise<{ id: string }>['finally'];
//         [Symbol.toStringTag]: string;
//     };
// }

interface PageProps {
    params: {
        id: string;
    };
}

interface Event {
    id: string;
    title: string;
    date: Date;
    pricePaidInCents: number;
    clientId: string;
    isAvailableForPurchase: boolean;
    NumberOfTickets: number;
    imagePath: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = params;
    const event: Event | null = await db.event.findUnique({ where: { id } });

    if (!event) {
        return <div>Event not found</div>; // Handle case where event is not found
    }

    return (
        <>
            <PageHeader>Edit Event</PageHeader>
            <EventForm event={event} />
        </>
    );
}