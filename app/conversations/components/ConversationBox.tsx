'use client';

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import { Conversation, Message, User } from "@prisma/client";
import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
    data: FullConversationType;
    selected?: boolean;
};

const ConversationBox: React.FC<ConversationBoxProps> = ({
    data,
    selected
}) => {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [data.id, router]);

    // constan for text in UI
    const lastMessage = useMemo(() => {
        const messages = data.messages || [];

        return messages[messages.length - 1];
    }, [data.messages]);

    const userEmail = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);

    // VERY IMP:constant for if current user has seen the last Message
    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false;
        };

        // array of users that has seen the last message
        const seenArray = lastMessage.seen || [];

        if (!userEmail) {
            return false;
        };

       
        // returnin a boolean fro hasSeen or not  for current user
        // look at logic very very simple
        return seenArray
            .filter((user) => user.email === userEmail).length !== 0;
    }, [,userEmail, lastMessage]);

    const lastMessageText = useMemo(() => {

        // if the last message if image then we cannot display any test
        if (lastMessage?.image) {
            return 'Sent an Image'
        };

        if (lastMessage?.body) {
            return lastMessage.body;
        };

        // if we just started the conversation
        return 'Started a conversation';
    },[lastMessage]);

    return (
        <div
            onClick={handleClick}
            className={clsx(`
                w-[90%]
                relative
                flex
                items-center
                space-x-3
                p-3
                hover:bg-[#18273b]
                rounded-lg
                transition
                cursor-pointer
                animate-[pointer_400ms_infinite]
                group
            `
            )}
        >
            <div
                className={clsx(`
                rounded-full
                outline-5
                outline
                outline-offset-2 
                outline-[#667b8b]/50
                group-hover:outline-[#d0a24e]
                `,
                selected ? 'outline-[#efca86]':''
                )}
            >
                {data.isGroup ? (
                    <AvatarGroup users={data.users} />
                ):
            <Avatar user={otherUser} />
                }
            </div>
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none"></div>
                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-1
                    "
                >
                    <p
                        className="
                            text-2xl
                            font-medium
                            text-white
                            font-pixel
                            truncate
                        "
                    >
                        {/* data.name is for group chat  */}
                        {data.name || otherUser.name}
                    </p>
                    {/* for showinf when the last message was created */}
                    {lastMessage?.createdAt && (
                        <p
                            className="
                                text-xs
                                text-gray-400
                                font-light
                            "
                        >
                            {/* format is of data fns package and p is the pattern of format*/}
                            { format(new Date (lastMessage.createdAt),'p') }
                        </p>
                    )}
                </div>
                {/* showing the last message */}
                <p
                    className={clsx(`
                        truncate
                        text-sm
                    `,
                        hasSeen ? 'text-gray-300/50' : 'text-white font-medium'
                    )}
                >
                    {lastMessageText}
                </p>
            </div>
        </div>
    )
}

export default ConversationBox