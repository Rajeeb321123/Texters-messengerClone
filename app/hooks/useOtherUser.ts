
// finding other User of a particular conversaiton with no current user inside it
// useful in setting the name of 1 to 1 conversation dynamically to the name of other person and show their in image


import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { FullConversationType } from "../types"; 
import { User } from "@prisma/client";

const useOtherUser = (conversation: FullConversationType | {
    users: User[]
}) => {
    const session = useSession();

    const otherUser = useMemo(() => {
        const currentUserEmail = session?.data?.user?.email;

        // removing the current user
        const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail)

        return otherUser[0];
    },[session?.data?.user?.email, conversation.users] );

    return otherUser;
};

export default useOtherUser;