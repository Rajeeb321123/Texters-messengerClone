// register routes

import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';

export async function POST(
    request: Request
) {
    try {
        // extract the body
        const body = await request.json();
        const {
            email,
            name,
            password,
        } = body;

        if (!email || !name || !password) {
            return new NextResponse('Missing info', { status: 400 });
        };

        // encrypt the password we got from client, 12 is salt
        const hashedPassword = await bcrypt.hash(password, 12);

        // creating the user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
            }
        });

        return NextResponse.json(user);
    }
    catch (error: any) {
        // IMP
        // console logging error with registaion_error helps to know in which the error occur
        console.log ( error, 'RESGISTRAION_ERROR' );
        return new NextResponse ('Internal Error', { status: 500 });
    }

}