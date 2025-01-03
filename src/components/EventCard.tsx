import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "./ui/button";
import Link from "next/link";

type EventCardProps = {
    id: string
    title: string
    pricePaidInCents: number
    description: string
    imagePath: string
}

export function EventCard({id, title, imagePath, pricePaidInCents, description}: EventCardProps) {
    console.log(imagePath);
    
    return (
        <Card className="flex overflow-hidden flex-col">
            <div className="relative w-full h-auto aspect-video">
                <Image src={imagePath} fill alt={title}/>
            </div>
            <CardHeader>   
                <CardTitle>{title}</CardTitle>
                <CardDescription>{formatCurrency(pricePaidInCents / 100)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="line-clamp-4">{description}</p>
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full bg-blue-600">
                    <Link href={`/events/${id}/purchase`}>Purchase</Link>
                </Button>
            </CardFooter>

        </Card>
    )
}


export function ProductCardSkeleton(){
    return(
        <Card className="flex overflow-hidden flex-col animate-pulse">
        <div className="w-full aspect-video bg-gray-300">
        </div>
        <CardHeader>
            <CardTitle>
                <div className="w-3/4 h-6 rounded-full bg-gray-300"></div>
            </CardTitle>
            <CardDescription>
                <div className="w-1/2 h-4 rounded-full bg-gray-300"></div>
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <div className="w-full h-4 rounded-full bg-gray-300"/>
            <div className="w-full h-4 rounded-full bg-gray-300"/>
            <div className="w-3/4 h-4 rounded-full bg-gray-300"/>
        </CardContent>
        <CardFooter>
            <Button  size="lg" disabled className="w-full">
            </Button>
        </CardFooter>

    </Card>
    )
}