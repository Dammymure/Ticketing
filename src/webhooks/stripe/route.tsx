import PurchaseReceiptEmail from "@/email/PurchaseReceipt";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { Resend } from "resend";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import generateQrCodeUrl from "@/app/(customerFacing)/actions/receipt";
const prisma = new PrismaClient()


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const resend = new Resend(process.env.RESEND_API_KEY as string)


export async function POST(req: NextRequest){
    const event = await stripe.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature") as string, process.env.STRIPE_WEBHOOK_SECRET as string)

    if(event.type === "charge.succeeded"){
        const charge = event.data.object
        const eventId = charge.metadata.eventId
        const email = charge.billing_details.email
        const pricePaidInCents = charge.amount


        const mainevent = await prisma.event.findUnique({ where: { id: eventId}})
        if(mainevent == null || email == null){
            return new NextResponse("Bad Request", { status: 400})
        }


        // create user and update user, and if user already created update order
        const userFields = {
            email,
            event: { create: { eventId, pricePaidInCents }}
        };

        const user = await prisma.user.create({
            data: userFields,
            select: { events: { orderBy: { createdAt: "desc" }, take: 1 }, id: true },
        });
    
        function generateSixDigitId(): string {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }
        
        // Example usage
        const ticketId = generateSixDigitId();
        console.log(ticketId); // Outputs a 6-digit ID, e.g., "123456"
    

        const downloadVerification = await prisma.ticketVerification.create({
            data: { eventId, userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), ticketId },
        })

        // await prisma.ticketVerification.upsert({})

        // const verifyTicket = (await prisma.ticketVerification.findFirst({ where: { eventId: mainevent.id, userId: user.id }}))?.ticketId

        await resend.emails.send({
            from: `Support <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "Order Confirmation",
            react: <PurchaseReceiptEmail 
            event={mainevent}
            downloadVerificationId={downloadVerification.ticketId || ""}
            />,
        })
    }   
    return new NextResponse() 

}