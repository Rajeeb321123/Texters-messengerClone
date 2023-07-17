'use client';

import { useState } from "react";
import { FcSettings } from 'react-icons/fc';
import { MdOutlineVideoCall } from 'react-icons/md';

import { User } from "@prisma/client";

import useRoutes from "@/app/hooks/useRoutes";
import DesktopItem from "./DesktopItem";
import Avatar from "../Avatar";
import SettingModal from "./SettingModal";
import OpenRoomModal from "./OpenRoomModal";
import VideoCallModal from "./VideoCall";


interface DesktopSidebarProps {
  currentUser?: User | null
};

const DesktopSidebar:React.FC<DesktopSidebarProps> = ({
  currentUser,
}) => {
  const routes = useRoutes();
  //for opening the setting module 
  const [isOpen, setIsOpen] = useState(false);

  const[isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomName, setRoomName] = useState<string>();
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  console.log(roomName)

 


  return (
    <>
      <SettingModal currentUser={currentUser} isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
          hidden
          mt-[4px]
          ml-[6px]
          mb-[20px]
          lg:fixed
          lg:inset-y-0
          lg:left-0
          lg:z-40
          lg:w-20
          xl:px-6
          lg:overflow-y-auto
          lg:bg-[#1b3347]/[0.95]
          
          
          lg:pb-4
          lg:flex
          lg:flex-col
          justify-between
          
          "
          >
        <nav
          className="
          mt-4
          flex
          flex-col
          justify-between
          "
          >
          <ul
            role="list"
            className="
            flex
            flex-col
            items-center
            space-y-1
            "
            >
            {/* mapp over our routes from useRoutes hook we created */}
            {routes.map((item)=>(
              <DesktopItem
              key={item.label} 
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={item.active}
              onClick={item.onClick}
              />
              ))}
          </ul>
        </nav>
        <nav
          className="
          mt-4
          flex
          flex-col
          justify-between
          items-center
          gap-20
          "
          >
            <div
              onClick={() => setIsRoomModalOpen(true)}
              className="
              relative 
              flex
              items-center
              justify-center
              overflow-hidden
              h-9 
              w-9 
              md:h-11 
              md:w-11
              group
              cursor-pointer
              animate-[pointer_400ms_infinite]
              text-gray-400
              
              "
            >
                <MdOutlineVideoCall  className='group-hover:scale-110' size={40}/>
            </div>

            <div
              onClick={() => setIsOpen(true)}
              className="
              relative 
              flex
              items-center
              justify-center
              overflow-hidden
              h-9 
              w-9 
              md:h-11 
              md:w-11
              group
              cursor-pointer
              animate-[pointer_400ms_infinite]
              
              "
            >
                <FcSettings  className='group-hover:animate-spin' size={40}/>
            </div>
            
          <div
            onClick={() => setIsOpen(true)}
            className="
            cursor-pointer
            animate-[pointer_400ms_infinite]
            hover:opacity-75
            transition
            group
            "
            >

              <div
                className='
                  rounded-full
                  outline-5
                  outline
                  outline-offset-2 
                  outline-[#667b8b]/50
                  group-hover:outline-[#d0a24e]
                '
              >
                <Avatar user={currentUser} />
            </div> 
          </div>
        </nav>
      </div>
    </>
  )
}

export default DesktopSidebar