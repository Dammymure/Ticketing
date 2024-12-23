import { PageHeader } from "../../../_components/PageHeader";
import { EventForm } from "../../_components/EventForm";
import db from "@/db/db";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}


export default async function EditProductPage({ params }: EditProductPageProps) {
    const event = await db.event.findUnique({ where: { id: params.id } });

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