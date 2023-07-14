// for deleting the conversation

import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from '@/app/libs/prismadb';
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
    conversationId?: string;
};

export async function DELETE (
    request: Request,
    { params }: { params: IParams}
) {
    try{
        const { conversationId } = params;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse('Unathorized', { status:401 });
        };

        // we cannot directly delete the conversation as we are using pusher for realtime delete in UI
        // and also we need users for that but that requires include property that doesnot work on deletMany
        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include:{
                users:true
            }
        });

        if (!existingConversation) {
            return new NextResponse('Invalid ID', { status: 400 });
        };

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                // only user who are part of group can remove the conversation
                userIds:{
                    hasSome: [currentUser.id]
                }
            },
        });

        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
            };
        });
        

        return NextResponse.json(deletedConversation);
    }
    catch (error: any) {
        console.log(error, 'ERROR_CONVERSATION_DELETE');
        return new NextResponse('Internal Error', {status: 500});
    }
}