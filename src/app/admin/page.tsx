import Link from "next/link"
import { PageHeader } from "./_components/PageHeader"
// import db from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB

async function getClientData(){
    const [allClients] = await Promise.all([
        prisma.client.count(),
    ])
    return allClients
}

async function getSalesData() {
    const [ticketVerifications, userCount] = await Promise.all([
        prisma.ticketVerification.findMany({
            include: {
                event: {
                    select: {
                        pricePaidInCents: true,
                    },
                },
            },
        }),
        prisma.user.count(),
    ]);

    const totalAmount = ticketVerifications.reduce((sum, ticket) => sum + (ticket.event?.pricePaidInCents || 0), 0);
    const numberOfSales = ticketVerifications.length;

    return {
        amount: totalAmount / 100,
        numberOfSales,
        userCount,
    };
}

async function getUserData() {
    const [userCount, eventData] = await Promise.all([
        prisma.user.count(),
        prisma.event.aggregate({
            _sum: { pricePaidInCents: true}
        }),
    ])
    return {
        userCount,
        averageTicketValuePerUser: userCount === 0 ? 0 : ((eventData._sum.pricePaidInCents || 0) / userCount )
    }
}

async function getEventData(){
    const [activeCount, inactiveCount] = await Promise.all([
        
        prisma.event.count({where: {isAvailableForPurchase: true}}),
        prisma.event.count({where: {isAvailableForPurchase: false}})
    ])
    return { activeCount, inactiveCount }
}

export default async function AdminDashboard(){
    const [salesData, userData, eventData, clientData] = await Promise.all([
        getSalesData(),
        getUserData(),
        getEventData(),
        getClientData()
    ])


    return (
    <>
        <PageHeader>Dashboard</PageHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-col-3 lg:grid-col-3 gap-4">
        <DashboardCard 
        title={"Sales"} 
        subtitle={`${formatNumber(salesData.amount)} Tickets Sales`} 
        body={`${formatCurrency(salesData.numberOfSales)} of ticket sales`} 
        href="/sales"       
        />
        <DashboardCard 
        title={"Customers"} 
        subtitle={`${formatCurrency(userData.averageTicketValuePerUser)} Average ticket value`} 
        body={`From ${formatNumber(userData.userCount)} users`} 
        href="/customer"              
        />
        <DashboardCard 
        title={"Active events"} 
        subtitle={`${formatNumber(eventData.inactiveCount)} Inactive Events`} 
        body={`${formatNumber(eventData.activeCount)} Active Events`}   
        href="/events"            
        />
        <DashboardCard 
        title={"Client"} 
        subtitle={`${formatNumber(clientData)} Clients`} 
        body={`XXX Client data`}   
        href="/events"            
        />
        </div>
    </>
    )
}

type DashboardCardProps = {
    title: string
    subtitle: string
    body: string
    href: string
}

function DashboardCard({title, subtitle, body, href}: DashboardCardProps){
    return  (<Link href={href} className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-purple-300">
    <div className="flex flex-col space-y-1.5 p-6">
        <div className="text-2xl font-semibold leading-none tracking-tight">
            {title}
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
    <div className="p-6 pt-0">
        <p>{body}</p>
    </div>
</Link>)
}