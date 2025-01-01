import db from "@/db/db"
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { CheckoutForm } from "./_components/CheckoutForm";
const prisma = new PrismaClient();
// import { CheckoutForm } from "./_components/CheckoutForm"

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function PurchasePage({params}: {params: Promise<{ id: string }>}){
    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id }})
    if (event == null) return notFound()

    const paymentIntent = await stripe.paymentIntents.create({
        amount: event.pricePaidInCents,
        currency: "USD",
        metadata: { eventId: event.id }
    })

    if (paymentIntent.client_secret == null){
        throw Error("Stripe failed to create payment intent")
    }

    return <CheckoutForm 
    event={event}
    clientSecret={paymentIntent.client_secret}
    />
}