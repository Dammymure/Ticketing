import db from "@/db/db";
import { PageHeader } from "../../../_components/PageHeader";
import { EventForm } from "../../_components/EventForm";

type EditEventPageProps = {
    params:{
        id: Promise<any>;
    }
}

export default async function EditEventPage({ params }: EditEventPageProps) {

    const { id: idPromise } = params;
    const id = await idPromise;
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