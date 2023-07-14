import prisma from '@/app/libs/prismadb';

import getSession from './getSession';

const getUsers = async () => {
    const session = await getSession();

    if (!session?.user?.email) {
        return [];
    };

    try {
        // find all the users exluding our own user
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                // exluding the our current user in session
                NOT: {
                    email: session.user.email
                }
            }
        });

        return users;
    }
    catch(error: any) {
        return [];
    }
};

export default getUsers;
    
