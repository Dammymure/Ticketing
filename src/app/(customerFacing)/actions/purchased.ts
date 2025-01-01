"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export async function userOrderExists(email: string, productId: string) {
//     return ( await prisma.event.findUnique({ where: { users: { email }, productId}, select: { id: true }})) != null
// }

export async function findUserFromEvent(eventId: string, email: string) {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            users: {
                where: { email },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                },
            },
        },
    });

    return (event?.users.find((user) => user.id === user.id)) != null;
}