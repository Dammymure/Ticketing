import db from "@/db/db";
import { PageHeader } from "../../../_components/PageHeader";
import { EventForm } from "../../_components/EventForm";

interface PageProps {
    params: {
        then: string;
        catch: string;
        finally: string;
        [Symbol.toStringTag]: string;
        id: string;
    };
}

export default async function EditEventPage({ params }: PageProps) {
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