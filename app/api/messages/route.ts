// for sending the messages and image

import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';

export async function POST(
    request: Request
) {
    try{
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const {
            message,
            image,
            conversationId,
        } = body;
        
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        };

        // creating new message
        const newMessage = await prisma.message.create({
            data: {
                body: message,
                image: image,
                // connecting to conversation
                
                // we could have written coversation: coversationId like in sunShinefly but this is the better way
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id
                    }
                },
                // sender has already seen message while creating it
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                },
            },
            include: {
                seen: true,
                sender: true,
            }
        });

        // updating the conversation with new message created
        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            // while updating the converastion we must update the lastMessageAt
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }

        });

        

        // PUSHER on Server: for messages
        // VERY VERY IMP: pusher.trigger("my-channel", "my-event or key", { message: "hello world" });
        await pusherServer.trigger(conversationId,'messages:new', newMessage);
        
        // PUHSER on server: for Sidebar for last messge
        // getting the last messages
        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
        // we want to update the sidebar for the groupchat member
        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, 'conversation:update', {
               id: conversationId,
               messages: [lastMessage]

            })
        })

        return NextResponse.json(newMessage);
    }
    catch (error: any) {
        // best practice: write error_nameOfRoute for every routes to know from wher the error is coming from 
        console.log(error,"ERROR_MESSAGE");
        return new NextResponse('InternalError', { status: 500 })
    }
}