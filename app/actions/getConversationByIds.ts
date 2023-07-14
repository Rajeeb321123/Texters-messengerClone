// for getting the conversation in the page like '/conversations/64a67a8088eb1ee672ce19b1' with the id passed

import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversationById = async (
    ConversationId: string
) => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.email) {
            return null;
        };

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: ConversationId
            },
            include: {
                users: true
            }
        });

        return conversation;
    }
    catch (error: any) {
        return null;
    }
}

export default getConversationById;
