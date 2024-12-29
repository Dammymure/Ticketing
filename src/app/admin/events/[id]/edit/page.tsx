// import db from "@/db/db";
import { PageHeader } from "../../../_components/PageHeader";
import { EventForm } from "../../_components/EventForm";
import { useParams } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


// type EditEventPageProps = {
//     params:{
//         id: Promise<any>;
//     }
// }

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const event = await prisma.event.findUnique({ where: { id } });

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