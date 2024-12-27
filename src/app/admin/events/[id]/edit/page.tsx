'use client'
import db from "@/db/db";
import { PageHeader } from "../../../_components/PageHeader";
import { EventForm } from "../../_components/EventForm";
import { useParams } from 'next/navigation'


// type EditEventPageProps = {
//     params:{
//         id: Promise<any>;
//     }
// }

export default async function EditEventPage({ params}: any) {
    const { id } = params;

    const event = await db.event.findUnique({ where: { id } });

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