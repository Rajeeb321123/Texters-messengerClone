'use client';

import { useState } from "react";
import { FcSettings } from "react-icons/fc";
import { MdOutlineVideoCall } from 'react-icons/md';

import { User } from "@prisma/client";
import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import SettingModal from "./SettingModal";
import OpenRoomModal from "./OpenRoomModal";
import VideoCallModal from "./VideoCall";

interface MobileFooterProps {
    currentUser?: User | null
  };

const MobileFooter:React.FC<MobileFooterProps> = ({
    currentUser
}) => {
    const routes = useRoutes();
    const { isOpen } = useConversation();
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const[isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomName, setRoomName] = useState<string>();
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

    // if active coversation then we dont want to show mobile footer
    if (isOpen) {
        return null;
    };
    return (
        <>
            <SettingModal currentUser={currentUser} isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)} />
            
            <OpenRoomModal  
                isOpen={isRoomModalOpen} 
                setRoomName={(value) => setRoomName(value)} 
                onClose={() => setIsRoomModalOpen(false)} 
                setIsVideoCallOpen={() => setIsVideoCallOpen(true)}
            />
            {roomName && (

                
                <VideoCallModal  
                isOpen={isVideoCallOpen} 
                roomName={roomName}
                
                
                />
                )
            }

            <div
                className="
                fixed
                justify-between
                w-full
                bottom-0
                z-40
                flex
                item-center
                bg-gray
                border-t-[1px]
                lg:hidden
                
                "
                >
                {/* mapp over our routes from useRoutes hook we created */}
                {routes.map((item) => (
                    <MobileItem
                    key={item.label}
                    href={item.href}
                    icon={item.icon}
                    active={item.active}
                    onClick={item.onClick}
                    />
                    ))}
                <div
                onClick={() => setIsSettingOpen(true)}
                className="
                absolute
                top-[-50px]
                right-[-20px]
                flex
                items-center
                justify-center
                overflow-hidden
                gap-2
                h-9 
                w-40 
                md:h-11 
                md:w-11
                group
                
                "
                >
                    <FcSettings  className='group-hover:animate-spin' size={40}/>
                </div>   
                <div
                onClick={() => setIsRoomModalOpen(true)}
                className="
                absolute
                top-[-50px]
                left-[-20px]
                flex
                items-center
                justify-center
                overflow-hidden
                gap-2
                h-9 
                w-40 
                md:h-11 
                md:w-11
                group
                text-gray-400
                
                "
                >
                    <MdOutlineVideoCall  className='group-hover:scale-110' size={60}/>
                </div>   
                    
            
                </div >
            </>
  )
}

export default MobileFooter