import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe"
import generateQrCodeUrl from "../../actions/receipt";
const prisma = new PrismaClient();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function SuccessPage({searchParams}:{ searchParams: Promise<{ payment_intent: string}>}){ 
    const payment_intent = (await searchParams).payment_intent;


    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

    if (paymentIntent.metadata.eventId == null) return notFound()
        
    const event = await prisma.event.findUnique({ where: { id: paymentIntent.metadata.eventId }})

    if (event == null) return notFound()
    
    const isSuccess = paymentIntent.status === "succeeded"

    // generate ticket id
    function generateSixDigitId(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    // Example usage
    const ticketId = generateSixDigitId();
    console.log(ticketId); // Outputs a 6-digit ID, e.g., "123456"

   // Create verification
   async function createVerification(eventId: string, ticketId: string) {
    return (await prisma.ticketVerification.create({
        data: { eventId, ticketId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) },
    })).ticketId;
    }

    const verificationId = await createVerification(event.id, ticketId);
    console.log('Created verification ID:', verificationId);

    // GENERATE QRCODE WITH TICKET ID
    // const url = `https://api.qrserver.com/v1/create-qr-code/?size=84x84&data=${ticketId}`;



    const url = generateQrCodeUrl(ticketId);


        
    return  (<div className="max-w-5xl w-full mx-auto space-y-8">
        <h1 className="text-4xl font-bold">{isSuccess ? "Success!" : "Error!"}</h1>
    <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
        <Image 
        src={url}
        fill alt={event.title} 
        className=""/>
        </div>
        <div>
            <div className="text-lg">
                {formatCurrency(event.pricePaidInCents / 100)}
            </div>
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <div className="line-clamp-3 text-muted-foreground">
                {event.description}
            </div>
            <Button className="mt-4" size="lg" asChild>
                {isSuccess ? (
                    <a 
                    href={`/products/download/${verificationId}`}
                    >
                        Download</a>
                ):(
                    <Link href={`/products/${event.id}/purchase`}>Try Again</Link>
                )}
            </Button>
        </div>
    </div>
</div>)
}

// async function createDownloadVerification(eventId: string, ticketId: string){
//     return (await prisma.ticketVerification.create({
//         data: { eventId, ticketId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)},
//     })).ticketId
// }