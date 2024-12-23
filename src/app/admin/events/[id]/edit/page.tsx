import { PageHeader } from "../../../_components/PageHeader";
import { EventForm } from "../../_components/EventForm";
import db from "@/db/db";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
    const resolvedParams = await params; // Await the params if it's a Promise
    const { id } = resolvedParams;

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