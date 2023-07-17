// hooks just to return routes for icons shown like in DesktopSidebar

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { 
    HiArrowLeftOnRectangle,
    HiUsers
} from 'react-icons/hi2';
import { signOut } from 'next-auth/react';

import useConversation from "./useConversation";


const useRoutes = () => {
    // getting the current pathname
    const pathname = usePathname();
    const { conversationId } = useConversation();

    const randomString = Math.random().toString(36).slice(2);

    const routes = useMemo(() => [
        {
            label:'Chat',
            href: '/conversations',
            icon: HiChat,
            active: pathname === '/conversationId' || !!conversationId
        },
        {
            label: 'Users',
            href: '/users',
            icon: HiUsers,
            active: pathname === '/users'
        },
        {
            label: 'VideoCall',
            href: `/room/${randomString}`,
            icon: HiUsers,
            active: pathname === '/room'
        },
        {
            label: 'logout',
            href: '#',
            onClick: () => signOut(),
            icon: HiArrowLeftOnRectangle
        },
    ],[pathname,conversationId]);

    return routes;
}

export default useRoutes;
