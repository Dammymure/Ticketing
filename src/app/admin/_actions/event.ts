"use server"

import db from "@/db/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

const fileSchema = z.instanceof(File, { message: "Required" });

const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"));

const addSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    clientName: z.string().min(1),
    clientEmail: z.string().email("Invalid email address"),
    date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date" }).transform(val => new Date(val)),
    pricePaidInCents: z.coerce.number().int().min(1),
    NumberOfTickets: z.coerce.number().int().min(1),
    image: imageSchema.refine(file => file.size > 0, "")
});

export async function addEvent(prevState: unknown, formData: FormData) {
    console.log("Form Data:", Object.fromEntries(formData.entries()));

    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

    if (result.success === false) {
        console.error("Validation Errors:", result.error.formErrors.fieldErrors);
        return result.error.formErrors.fieldErrors;
    }

    const data = result.data;
    console.log("Parsed Data:", data);

    // create public folder to hold event images
    await fs.mkdir("public/events", { recursive: true });
    const imagePath = `/events/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

    let client = await db.client.findUnique({
        where: { email: data.clientEmail },
    });

    if (!client) {
        client = await db.client.create({
            data: {
                name: data.clientName,
                email: data.clientEmail,
            }
        });
    }

    console.log("Client:", client);

    // Create the event using the client ID
    const event = await db.event.create({
        data: {
            isAvailableForPurchase: false,
            title: data.title,
            date: data.date,
            pricePaidInCents: data.pricePaidInCents,
            clientId: client.id,
            NumberOfTickets: data.NumberOfTickets,
            imagePath,
            description: data.description,
        },
    });

    console.log("Event:", event);

    revalidatePath("/");
    revalidatePath("/events");
    redirect("/admin/events");
}

const editSchema = addSchema.extend({
    // file: fileSchema.optional(),
    image: imageSchema.optional()
})

export async function updateEvent(id: string, prevState: unknown, formData: FormData){
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()))

    if(result.success === false){
        return result.error.formErrors.fieldErrors
    }

    const data = result.data 
    console.log("Parsed Data:", data);
    const event = await db.event.findUnique({ where: {id}})
    const clientId = event?.clientId
    const client = await db.client.findUnique({ where: {id: clientId}})

    if(event == null) return notFound()

    let imagePath = event.imagePath
    if(data.image != null && data.image.size > 0){
        await fs.unlink(`public${event.imagePath}`)
        imagePath = `/events/${crypto.randomUUID()}-${data.image.name}`
        await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
    }

    // Create the event using the client ID
    await db.event.update({
        where: {id},
        data:{
            isAvailableForPurchase: false,
            title: data.title,
            date: data.date,
            clientId: clientId,
            pricePaidInCents: data.pricePaidInCents,
            NumberOfTickets: data.NumberOfTickets,
            imagePath,
            description: data.description,
        }},
      );

      console.log("Event:", event);

      redirect("/admin/events");

}

export async function getClientData(id: string) {
    const client = await db.client.findUnique({ where: { id } });
    if (!client) return notFound();
    return client;
}




export async function toggleEventAvailability(
    id: string, 
    isAvailableForPurchase: boolean){
    await db.event.update({where: { id }, data: { isAvailableForPurchase}})


    // revalidatePath("/")
    // revalidatePath("/products")
}

export async function deleteEvent(id: string){
    const event = await db.event.delete({ where: {id} })
    if (event == null) return notFound()

    await fs.unlink(`public${event.imagePath}`)

    // revalidatePath("/")
    // revalidatePath("/products")
}

