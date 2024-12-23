import db from "@/db/db";
import { PageHeader } from "../../../_components/PageHeader";
import { EventForm } from "../../_components/EventForm";


export default async function EditEventPage({ params }: { params: { id: any } }){
    const event = await db.event.findUnique({ where: { id: params.id } });
    return( <>
    <PageHeader>Edit Event</PageHeader>
    <EventForm event={event}/>
    </>)
}