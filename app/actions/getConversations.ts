import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';


// GETTING ALL THE CONVERSATIONS WHICH HAS CURRENTUSER.ID IN ITS USERIDS ARRAY
// means gettin all the current user conversations
const getConversations = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return [];
    };

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users:true,
                // messages is array of Message 
                messages:{
                    include:{
                        // sender is the author of message 
                        sender: true,
                        // seen is the array of people that seen the message
                        seen: true,
                    }
                }
            }
        });

        return conversations;
    }
    catch ( error: any ) {
        return [];
    }
};

export default getConversations;