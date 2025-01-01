import { formatCurrency } from "@/lib/formatters"
import { Button, Column, Img, Row, Section, Text } from "@react-email/components"

type EventInformationProps = {

    event:{
        id: string;
        title: string;
        pricePaidInCents: number
        description: string;
        createdAt: Date;
    }
    downloadVerificationId: string
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium"})

export function TicketInformation({ event, downloadVerificationId }: EventInformationProps){
    return <>
        <Section>
            <Row>
                <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">Event ID</Text>
                    <Text className="mt-0 mr-4">{event.id}</Text>
                </Column>
                <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">Purchased On</Text>
                    <Text className="mt-0 mr-4">{dateFormatter.format(event.createdAt)}</Text>
                </Column>
                <Column>
                    <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">Price Paid</Text>
                    <Text className="mt-0 mr-4">{formatCurrency(event.pricePaidInCents / 100)}</Text>
                </Column>
            </Row>
        </Section>

        <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
            <Img
            width="100%"
            alt={event.title} 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=84x84&data=${downloadVerificationId}`}
            />
            <Row className="mt-8">
                <Column className="align-bottom">
                    <Text className="text-lg font-bold m-0 mr-4">{event.title}</Text>
                </Column>
                <Column align="right">
                    <Button href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerificationId}`} className="bg-black text-white px-6 py-4 rounded text-lg">Download</Button>
                </Column>
            </Row>

            <Row>
                <Column>
                    <Text className="text-gray-500">{event.description}</Text>
                </Column>
            </Row>
        </Section>


    </>
}

