import { PageHeader } from "../../../_components/PageHeader";
import { EventForm } from "../../_components/EventForm";
import db from "@/db/db";


export type paramsType = Promise<{ id: string }>;


export default async function EditProductPage(props: { params: paramsType }) {
    const { id } = await props.params;


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