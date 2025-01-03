"use client"
import { findUserFromEvent } from "@/app/(customerFacing)/actions/purchased"
// import { userOrderExists } from "@/app/actions/order"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"
import { FormEvent, useState } from "react"


type CheckoutFormProps = {
    event: {
        id: string
        // imagePath: string
        title: string
        pricePaidInCents: number
        description: string
    }
    clientSecret: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)

export function CheckoutForm({ event, clientSecret}: CheckoutFormProps){
    return (
        <div className="max-w-5xl w-full mx-auto space-y-8">
            <div className="flex gap-4 items-center">
                <div className="aspect-video flex-shrink-0 w-1/3 relative">
                <Image 
                src={`/events/${event.id}.jpeg`} 
                fill alt={event.title} 
                className="object-cover"/>
                <h1>{event.title}</h1>
                </div>
                <div>
                    <div className="text-lg">
                        {formatCurrency(event.pricePaidInCents / 100)}
                    </div>
                    <h1 className="text-2xl font-bold">{event.title}</h1>
                    <div className="line-clamp-3 text-muted-foreground">
                        {event.description}
                    </div>
                </div>
            </div>


            <Elements options={{ clientSecret }} stripe={stripePromise}>
                <Form pricePaidInCents={event.pricePaidInCents} eventId={event.id}/>
            </Elements>

        </div>
    )
}

function Form({ pricePaidInCents, eventId} : { pricePaidInCents: number, eventId: string}) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>()
    const [email, setEmail] = useState<string>()

    async function handleSubmit(e: FormEvent){
        e.preventDefault()

        if(stripe == null || elements == null || email == null) return
        setIsLoading(true)

        const userAlreadyPurchased = await findUserFromEvent(email, eventId)

        if (userAlreadyPurchased) {
            setErrorMessage("You have already purchased this ticket, try checking your email for your passcode.")
            setIsLoading(false)
            return
        }

        stripe.confirmPayment({ elements, confirmParams: {
            return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`
        }}).then(({ error }) => {
            if(error.type == "card_error" || error.type === "validation_error"){
                setErrorMessage(error.message)
            }else{
                setErrorMessage("An unknown error occured")
            }
        }).finally(() => setIsLoading(false))

    }

    return (<form onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Checkout</CardTitle>
                {errorMessage && <CardDescription className="text-destructive">{errorMessage}</CardDescription>}
            </CardHeader>
            <CardContent>
                    <PaymentElement/> 

                    <div className="mt-4">
                        <LinkAuthenticationElement onChange={e => setEmail(e.value.email)}/>
                    </div>
            </CardContent>

            <CardFooter>
                <Button className="w-full" size="lg" disabled={stripe == null || elements == null || isLoading}>
                    {isLoading ? "Purchasing..." : `Purchasing - ${formatCurrency(pricePaidInCents / 100)}`}
                </Button>
            </CardFooter>
        </Card>
        
    </form>)
}