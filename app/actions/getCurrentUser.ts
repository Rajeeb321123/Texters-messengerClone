// getting the current user

import prisma from '@/app/libs/prismadb';

import getSession from './getSession';

const getCurrentUser = async () => {
    try{
        const session = await getSession();

        if (!session?.user?.email) {
            return null;
        };

        // getting the user from database with session.user
        const currentUser = await prisma.user.findUnique({
            where:{
                email: session.user.email as string
            }
        });

        if (!currentUser) {
            return null;
        };

        return currentUser;

    }
    catch (error:any) {
        // dont try to throw any error as it will break the app. It isnot an api route rather it is a server action
        return null;
    }
    
};

export default getCurrentUser;