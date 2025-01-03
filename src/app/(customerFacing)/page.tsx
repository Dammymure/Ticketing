import { EventCard, ProductCardSkeleton } from "@/components/EventCard"
import { Button } from "@/components/ui/button"
// import { cache } from "@/lib/cache"
import { Event } from "@prisma/client"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const getMostPopularEvents = () =>{
    return prisma.event.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { users: { _count: "desc"}},
        take: 6
    })
}
const getNewestEvents = () =>{
    return prisma.event.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { createdAt: "desc"},
        take: 6
    })
}



export default function HomePage(){
    return <main className="space-y-12">
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Discover Amazing Events Near You</h1>
            <p className="text-xl mb-8">Find and book tickets for the hottest concerts, sports games, and more!</p>
            <Link href="/events" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
              Explore Events
            </Link>
          </div>
        </section>
        <EventGridSection title="Most Popular" eventsFetcher={getMostPopularEvents}/>
        <EventGridSection title="Newest" eventsFetcher={getNewestEvents}/>

    </main>
}

type EventGridSectionProps = {
    title : string
    eventsFetcher: () => Promise<Event[]>
}


function EventGridSection({ eventsFetcher, title }: EventGridSectionProps){
    return (
        <>

            <div className="space-y-4">
                <div className="flex gap-4">
                    <h2 className="text-3xl font-bold flex items-center"><TrendingUp/>{title}</h2>
                    <Button variant="outline" asChild>
                        <Link href="/products" className="space-x-2">
                            <span>View All</span>
                            <ArrowRight className="size-4"/>
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-col-2 lg:grid-col-3 gap-4">
                    <Suspense
                    fallback={
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-col-2 lg:grid-col-3 gap-4">
                        <ProductCardSkeleton/>
                        <ProductCardSkeleton/>
                        <ProductCardSkeleton/>
                        </div>
                    }
                    >
                        <EventSuspense eventsFetcher={eventsFetcher}/>
                    </Suspense>

                </div>
            </div>
        
        </>
    )

}

async function EventSuspense({eventsFetcher,}: {eventsFetcher: () => Promise<Event[]>
}){

    return(
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-col-2 lg:grid-col-3 gap-4">
        { (await eventsFetcher()).map(event => (
            <EventCard key={event.id} {...event} imagePath={`/events/${event.id}.jpeg`}/>
        )) }
    </div>)
}