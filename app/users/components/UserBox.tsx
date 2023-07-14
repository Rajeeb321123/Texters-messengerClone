'use client';

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UserBoxProps {
    data: User;
};

const UserBox:React.FC<UserBoxProps> = ({
    data,
}) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true);
        // to start the conversation to user on click
        axios.post('/api/conversations',{
            userId: data.id
        })
        .then((data) => {
            router.push(`/conversations/${data.data.id}`);
        })
        .finally(() => setIsLoading(false));
    },[data,router]);


  return (
    <>
        {isLoading && ( 

            <LoadingModal />
        )}
        <div
            onClick={handleClick}
            className="
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
                <Avatar user={data} />
            </div> 
            <div className="min-w-0 flex-1">
                <div className="focsu:outline-none">
                    <div
                        className="
                            flex
                            jusitify-between
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
                            {data.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default UserBox