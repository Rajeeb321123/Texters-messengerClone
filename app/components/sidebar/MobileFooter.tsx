'use client';

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import { FcSettings } from "react-icons/fc";
import SettingModal from "./SettingModal";
import { useState } from "react";
import { User } from "@prisma/client";

interface MobileFooterProps {
    currentUser?: User | null
  };

const MobileFooter:React.FC<MobileFooterProps> = ({
    currentUser
}) => {
    const routes = useRoutes();
    const { isOpen } = useConversation();
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    // if active coversation then we dont want to show mobile footer
    if (isOpen) {
        return null;
    };
    return (
        <>
        <SettingModal currentUser={currentUser} isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)} />

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
                h-9 
                w-40 
                md:h-11 
                md:w-11
                group
                
                "
                >
                    <FcSettings  className='group-hover:animate-spin' size={40}/>
                </div>   
            
                </div >
            </>
  )
}

export default MobileFooter