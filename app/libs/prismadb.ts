// Best practice for Prisma Client 
// Utilis for Prisma db
// IMP: below code is done error shown by reloading of nextjs
// IMP: if we dont use global and directly use above import and new PrismaClient we get multiple newPrismaClient  due to hot reloading nature of Nextjs which will show error in terminal 
// types for prisma


import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;