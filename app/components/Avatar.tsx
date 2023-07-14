'use client';

import Image from "next/image";

import { User } from "@prisma/client";
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
    user?: User | null;
};

const Avatar: React.FC<AvatarProps> = ({
    user,
}) => {

    const { members } = useActiveList();
    console.log(members)
    // active if the user(ourself or otherUsers) is in thelist of membersa array
    const isActive = members.indexOf(user?.email!) !== -1;


  return (
    <div className="relative">
        <div
            className="
            relative 
            rounded-full 
            overflow-hidden
            h-9 
            w-9 
            md:h-11 
            md:w-11
            "
        >
            
        <Image 
            className="mt-auto mr-auto ml-auto mb-auto"
            alt='Avatar'
            src={user?.image || '/images/placeholder.jpg' }
            fill
        />
        </div>

        {isActive && (

        
        //for that green active status 
        <span
            className="
            absolute 
            block 
            rounded-full 
            bg-[green]
            ring-2 
            ring-white 
            top-0 
            right-0
            h-2 
            w-2 
            md:h-3 
            md:w-3
            
            "
        >
            <div 
            className="
                absolute
                top-0
                left-[-1px]
                blur
                rounded-full
                bg-[#d0a24e]/50
                w-full
                h-full
                outline-double
                outline-8
                outline-[green]
            "
            >
                &nbsp;
            </div>
        </span>
        )}
    </div>
    
  )
}

export default Avatar