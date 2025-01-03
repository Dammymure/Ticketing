import { Body, Container, Head, Heading, Html, Preview, Tailwind } from "@react-email/components";
import { TicketInformation } from "./_components/TicketInformation";

type PurchaseReceiptEmailProps = {
    event: { id: string
        title: string
        createdAt: Date
        pricePaidInCents: number
        description: string
     }
     downloadVerificationId: string
}



export default function PurchaseReceiptEmail({ event, downloadVerificationId }: PurchaseReceiptEmailProps){

    return (
        <Html>
            <Preview>View {event?.title} receipt</Preview>
            <Tailwind>
                <Head/>
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Heading>Purchase Receipt</Heading>
                        <TicketInformation event={event} downloadVerificationId={downloadVerificationId}/>
                    </Container>

                </Body>
            </Tailwind>
        </Html>
    )
}