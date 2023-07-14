// whenever we are in page like 'conversations/64a67a8088eb1ee672ce19b1' we want to make last message seen by adding our currentUserId in seenId of message

import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from '@/app/libs/pusher';

interface IParams {
    conversationId?: string;
};

export async function POST(
    request: Request,
    { params }: { params: IParams}
) {
    try {
        const currentUser = await getCurrentUser();
        const {
            conversationId
        } = params;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        };

        //finding the existing conversation
        const converastion = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {    
                    include: {
                        seen: true
                    }                
                },
                users:true
            }
        });

        // for wrong conversation Id
        if (!converastion) {
            return new NextResponse('Invalid ID', { status: 400});
        };

        // Find the last message with the help of fetched converstion
        const lastMessage = converastion.messages[converastion.messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json(converastion);
        };

        // Update the seen of last message with our Id
         // Update seen of last message
    const updatedMessage = await prisma.message.update({
        where: {
          id: lastMessage.id
        },
        data: {
          seen: {
            connect: {
              id: currentUser.id
            }
          }
        },
        include: {
          sender: true,
          seen: true,
        },
      });

      await pusherServer.trigger(currentUser.email, 'conversation:update', {
        id: conversationId,
        messages: [updatedMessage]
      });

      //checking that we have already seen the message or not 
      // IMP: indexof return -1 if the currrenUser.id doesnot exist in array
      // if we are already in array we wouldnot have -1 then return the conversation
      if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
          return NextResponse.json(converastion);
      };
      
      //alert every user that we have seen the message
      await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

      return NextResponse.json(updatedMessage);
    }
    catch (error: any) {
        console.log(error, 'ERROR_MESSAGES_SEEN inside converastion/[coversationId]/seen in  api');
        return new NextResponse("Internal", { status: 500 });
    }
}