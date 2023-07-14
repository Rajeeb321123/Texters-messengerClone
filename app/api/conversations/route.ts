// route for conversation

import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from '@/app/libs/prismadb';
import { pusherServer } from "@/app/libs/pusher";


// for creatin conversation(1-1 chat or group chat)
export async function POST(
    request: Request
) {
    try {
        const currentUser = await getCurrentUser();
        // getting the body from client
        // IMP: Group chat: body vaires for conversation fir  single user and the group chat
        const body = await request.json();
        const {
            // userId is the id othe person we want to have conversation with
            userId,
            // for group chat
            isGroup,
            // members are the ids of users
            members,
            // name of group
            name
        } = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        };

        // you cant make group without memberes , with just 2 member or with no name.
        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse('Invalid Data', { status: 400 });
        };


        // GROUP CHAT
        // create a Groupchat for isGroup === true
        // IMP:people can create any number of groupchat they want with exact group members
        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,

                    // users is array field in conversation schema that we created 
                    //we could have done it like users:  connect and logic on connect outside of here like in api/favorites/[listingId] in Sunshinefly app
                    users: {

                        // VERY VERY IMP : very logical steps are below
                        // connect will be the array of ids , connect can be any name , we could have written user:[]
                        // if we creating the group, member doesnot consist our id so we have to separately add our id 
                        connect: [
                            // spreading the ids of member and adding it connect array with each iteration
                            ...members.map((member: { value: string }) => ({
                                id: member.value
                            })),
                            // separately add the our currentuser.id if we are the creator of group
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },

                // we dont just id but we also want the user object so include user true for that reason
                // Nested reads like include allow you to read related data from multiple tables in your database
                include: {
                    users: true
                }
            });

            // pusher for groupChat conversation
            newConversation.users.forEach((user) => {
                if (user.email) {
                    pusherServer.trigger(user.email, 'conversation:new', newConversation);
                };
            });

            return NextResponse.json(newConversation);
        };


        // ONE on ONE CHAT
        // for 1 to 1 chat
        // IMP:We cannot create more than chat for exact member of conversation
        // IMP:so we have the check whether 1-1 conversaion already exist
        // we used findMany because equals query doesnot work with unique
        const existingConversations = await prisma.conversation.findMany({
            where: {
                // Here both cases in OR: are same but This is done because sometime it doesnot work if only one case in included
                // position of array create error sometime so we use OR and compare for all posible positions
                OR: [
                    {
                        // equals mean userIds array consituents equals array of [currentUser.id, userId]
                        // imp: eqauls doesnot means currentUse.id === userId rather userIds === [currentUser.id,userId]
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    }
                ]
            }
        });

        const singleConversation = existingConversations[0];

        // return if conversation already exists
        if (singleConversation) {
            return NextResponse.json( singleConversation );
        };

        // if conversation doesnot exists
        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        // first user
                        {
                            id: currentUser.id
                        },
                        // second user
                        {
                            id: userId
                        },

                    ]
                },
                
            },
            include: {
                users: true
            }
        });

        // puhser for 1-1 conversation
        newConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:new', newConversation);
            };
        })
        return NextResponse.json(newConversation);
    }
    catch (error: any) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}