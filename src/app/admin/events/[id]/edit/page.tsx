// import db from "@/db/db";
// import { PageHeader } from "../../../_components/PageHeader";
// import { EventForm } from "../../_components/EventForm";

// type EditEventPageProps = {
//     params:{
//         id: string;
//     }
       
// }

// export default async function EditEventPage({ params }: EditEventPageProps) {

//     const { id } = params;
//     const event = await db.event.findUnique({ where: { id } });

//     if (!event) {
//         return <div>Event not found</div>; // Handle case where event is not found
//     }

//     return (
//         <>
//             <PageHeader>Edit Event</PageHeader>
//             <EventForm event={event} />
//         </>
//     );
// }


    export default function EditEventPage(){
        return <h1>Hello</h1>
    }