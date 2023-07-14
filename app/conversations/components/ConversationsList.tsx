'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { MdOutlineGroupAdd } from 'react-icons/md';
import { PiLightbulbThin } from 'react-icons/pi'
import Image from "next/image";

import { User } from "@prisma/client";
import { FullConversationType } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import BlurGlow from "@/app/components/BlurGlow";
import GroupChatModal from "./GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationsListProps {
    // name is initialItem because it is just going to be the initial load 
    // we have to handle the update the load with pusher in realtime when every new message in sent
    initialItems: FullConversationType[];
    users: User[];
};

const ConversationsList:React.FC<ConversationsListProps> = ({
    // IMP: later we are going to update the initialItems in Real time with pusher
    initialItems,
    users
}) => {
    const session = useSession();
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const router = useRouter();
    
    const { conversationId, isOpen } = useConversation(); 

    // just the variable so we dont have to write session.data.user.email all the time
    // pusher key is just our email
    const pusherKey =  useMemo(()=>{
        return session.data?.user?.email;
    },[session.data?.user?.email])


    // very IMP:
    // for getting the realtime changes in conversationlist
    useEffect(() => {
        // if session hasnot been loaded yet
        if(!pusherKey) {
            return;
        };

        pusherClient.subscribe(pusherKey);

        // handler for changing list of items state above 
        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                // if there is existing conversation already then just return the current without changes so duplication doesnot happen
                // find is just from lodash . it just compare the current with query  
                if (find(current, { id: conversation.id})) {
                    return current;
                };

                // we put the new added conversation first so we get new conversation of the top
                return [conversation, ...current];
            });
        };

        // for hadling the update in last message below conversation name in a single conversation list
        // very imp: when we look at the message in messageBox with conversation.id channel. It will have chronological effect on this updatehandler  with user.email channel and make text gray.
        // thought we didnit do it from same channel and pusherServer. Seen route trigger the conversation update 
        const updateHandler = (conversation: FullConversationType) => {
            // checking each conversation
            setItems((current) => current.map((currentConversation) => {

                // updating the messages in conversation
                if (currentConversation.id === conversation.id){
                    return {
                        ... currentConversation,
                        messages: conversation.messages
                    }
                }

                // if no match is found just return the conversation
                return currentConversation;
            }) )
        }

        // for removing the conversation from conversationList if conversation is deleted
        const removeHandler = ( conversation: FullConversationType ) => {
            setItems(( current ) => {
                return [...current.filter((currentConversation) => currentConversation.id !== conversation.id )]
            });

            // just to redirect 
            if (conversationId === conversation.id) {
                router.push('/conversations');
            };
        };

        // it is in conversation .route with channel of user.email
        pusherClient.bind('conversation:new', newHandler);

        // it is in messenger .route with channel of user.email
        pusherClient.bind('conversation:update', updateHandler);

        // for real time delete of conversation
        pusherClient.bind('conversation:remove', removeHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:new', newHandler);
            pusherClient.unbind('conversation:update', updateHandler);
            pusherClient.unbind('conversation:remove', removeHandler);
        };

    },[pusherKey, conversationId, router]);
    return (
        <>
            <GroupChatModal 
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <aside
                className={clsx(`
                fixed
                lg:mt-[24px]
                lg:ml-[6px]
                lg:mb-[40px]
                inset-y-0
                pb-20
                lg:pb-0
                lg:left-20
                lg:w-80
                lg:block
                overflow-y-auto
                block
                w-full
                left-0
                realtive
                `,
                isOpen ? 'hidden' : 'block w-full left-0'
                )}
                >
                <Image
                    
                    alt='scifiborder'
                    className='sticky top-0 h-full w-full hidden lg:block opacity-50 z-[-90]'
                    fill
                    src='/images/scifiborder1.png'
                    />

                <div className="px-5">
                    <div className="flex justify-between lg:justify-start mb-4 pt-4">
                        <div
                            className="
                            text-2xl
                            font-bold
                            "
                            >
                            Messages
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="
                            ml-12
                            p-4
                            text-[#e8c179]
                            cursor-pointer
                            animate-[pointer_400ms_infinite]
                            hover:opacity-75
                            relative                            
                            "
                            >
                            <BlurGlow 
                                bgColor="#d0a24e"
                                outlineColor="#a28c70"
                                />
                            <div
                                className="
                                absolute
                                top-0
                                right-[1px]
                                text-[#956e46]
                                rotate-180
                                text-5xl
                                "
                                >
                                <PiLightbulbThin/>                            
                            </div>
                            <MdOutlineGroupAdd />
                        </div>
                    </div>
                    {items.map((item) => (
                        <ConversationBox 
                        key={item.id}
                        data={item}
                        selected={conversationId === item.id}
                        />
                        ))}
                </div>
            </aside>
        </>
    );
};

export default ConversationsList;