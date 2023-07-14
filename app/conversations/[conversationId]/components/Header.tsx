'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { BsMenuButtonWideFill } from "react-icons/bs";


import { Conversation, User } from "@prisma/client";

import Avatar from "@/app/components/Avatar";
import BlurGlow from "@/app/components/BlurGlow";
import useOtherUser from "@/app/hooks/useOtherUser";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps {
    conversation: Conversation & {
        users: User[]
    };
};
const Header: React.FC<HeaderProps> = ({
    conversation,
}) => {
    const otherUser = useOtherUser(conversation);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { members } = useActiveList();
    // active if the user(ourself or otherUsers) is in thelist of membersa array
    const isActive = members.indexOf(otherUser?.email!) !== -1;



    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} memebers`;
        };

        return isActive ? `Active` : 'Offline'
    }, [conversation, isActive]);

    return (
        <>
            <ProfileDrawer 
                data={conversation}
                isOpen={drawerOpen}
                onClose={()=> setDrawerOpen(false)}
            />

            
            <div
                className="
                    bg-whte
                    w-full
                    flex
                    border-b-[1px]
                    lg:border-l
                    lg:rounded-l-md
                    lg:border-r
                    lg:rounded-r-md
                    sm:px-4
                    py-3
                    px-4
                    lg:px-6
                    justify-between
                    items-center
                    shadow-sm
                "
            >
                <div className="flex gap-3 items-center">
                    <Link
                        href="/conversations"
                        className="
                            lg:hidden
                            block
                            text-[#a28c70]
                            hover:text-[#e8c179]
                            transition
                            cursor-pointer
                            animate-[pointer_400ms_infinite]
                        "
                    >
                        <div
                            className="
                                bg-[#3e204a]
                                rounded-lg
                                relative
                            "
                        >
                            <BlurGlow
                                outlineColor="#3e204a"
                                bgColor="#d0a24e"
                            />
                            <HiChevronLeft size={32} />
                        </div>
                    </Link>
                    {conversation.isGroup ? (
                        <AvatarGroup users={conversation.users} />
                    ):
                    <Avatar user={otherUser} />
                    }
                    <div className="flex flex-col">
                        <div
                            className="
                                text-2xl
                                font-medium
                                text-white
                                font-pixel
                                truncate
                            ">
                            {conversation.name || otherUser.name}
                        </div>
                        <div
                            className="
                                text-sm
                                font-light
                                text-neutral-500
                                flex
                                justify-start
                                gap-2
                                items-center
                            "
                        >
                            {statusText}
                            <strong
                                className={`
                                    text-[50px] 
                                    ${isActive ? 'text-[green]': 'text-red-600'}
                                    cursor-pointer
                                    
                                    ${isActive ? 'hover:text-sky-600': 'hover:text-[#7f00ff]'}
                                    
                                    animate-[blinkAnimation_2s_steps(5,start)_infinite]
                                    hover:animate-none
                                    transition
                                `}
                            >
                                -
                            </strong>

                        </div>
                    </div>

                </div>
                <div>

                </div>
                <div
                    onClick={() => setDrawerOpen(true)}
                    className="
                        block
                        text-[#a28c70]
                        hover:text-[#e8c179]
                        transition
                        cursor-pointer
                        animate-[pointer_400ms_infinite]
                        relative
                        group
                    "
                >
                    <BlurGlow
                        outlineColor="#3e204a"
                        bgColor="#d0a24e"
                    />
                    <BsMenuButtonWideFill
                        size={25}
                        className="
                        "
                    />
                </div>

            </div>
        </>
    );
}

export default Header;