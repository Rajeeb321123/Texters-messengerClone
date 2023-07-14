'use client';

import clsx from "clsx";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import { useState } from "react";
import ImageModal from "./ImageModal";

// our Message box

interface MessageBoxProps {
    data: FullMessageType;
    isLast?: boolean;
};

const MessageBox: React.FC<MessageBoxProps> = ({
    data,
    isLast,
}) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false)

    // condition to recognize whether message is own or of others , should display this message has been seen by someone etc...
    const isOwn = session?.data?.user?.email === data?.sender?.email;

    // creating the list of other users that have seen the message
    // confuse: we could have just wrote retrun statement in map rather than join(', '); it would given same result like [tom, henry, rajeeb]
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.name)
    .join(', ');


    // writing our dynamic css classNames
    const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
    const avatar = clsx(isOwn && 'order-2');
    const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
    const message = clsx(
        'text-sm w-fit overflow-hidden',
        isOwn ? 'bg-[#1f4a6b]/50 text-white' : 'bg-black/50',
        data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
    );

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender}/>
            </div>
            <div className={body}>
                <div className=" flex items-center gap-1">
                    <div className="text-2xl text-[white]/60 font-pixel">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-white/40">
                        {format(new Date(data.createdAt), 'p')}
                    </div>
                </div>
                <div className={message}>
                    <ImageModal 
                        src={data.image}
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                    />
                    {data.image ? (
                        <Image 
                            onClick={() => setImageModalOpen(true)}
                            alt='Image'
                            height='288'
                            width='288'
                            src={data.image}
                            className="
                                object-cover
                                cursor-pointer
                                animate-[pointer_400ms_infinite]
                                hover:scale-110
                                transtion
                                translate
                            "
                        />
                    ) : (
                        <div>{data.body}</div>
                    )}
                </div>
                {/* note: seenList doesnot consist our id as we removed them in clientside above here */}
                {isLast && isOwn && seenList.length > 0 && (
                    <div
                        className="
                            text-xs
                            font-light
                            text-white/40
                        "
                    >
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessageBox;