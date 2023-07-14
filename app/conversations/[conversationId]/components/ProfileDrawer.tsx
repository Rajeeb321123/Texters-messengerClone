'use client';

import { Fragment, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Transition, Dialog } from '@headlessui/react';
import { IoIosCloseCircleOutline, IoIosTrash } from 'react-icons/io';

import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import BlurGlow from '@/app/components/BlurGlow';
import Avatar from '@/app/components/Avatar';
import ConfirmModal from './ConfirmModal';
import AvatarGroup from '@/app/components/AvatarGroup';
import useActiveList from '@/app/hooks/useActiveList';

interface ProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    data: Conversation & {
        users: User[]
    };
};

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
    isOpen,
    onClose,
    data,
}) => {
    const otherUser = useOtherUser(data);

    const { members } = useActiveList();
    // active if the user(ourself or otherUsers) is in thelist of membersa array
    const isActive = members.indexOf(otherUser?.email!) !== -1;


    // for opening and closing the delete modal
    const [isConfrimModalOpen, setisConfrimModalOpen] = useState(false);

    // we want to show some info about the otherUser
    const joinedDate = useMemo(() => {
        return format (new Date(otherUser.createdAt),'PP');
    },[otherUser.createdAt]);

    const title = useMemo(() => {
        return data.name || otherUser.name;
    },[data.name, otherUser.name]);

    const statusText = useMemo(() => {
        if (data.isGroup) {
            return `${ data.users.length } members`
        };

        return isActive ? `Active` : 'Offline'
    },[data, isActive]);



  return (
    <>
    {/* model to make sure before delete */}
    <ConfirmModal 
        isOpen={isConfrimModalOpen}
        onClose={()=> setisConfrimModalOpen(false)}
    />

   
    {/* <Transition.Root is from headless UI */}
    <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className="relative z-50" onClose={onClose}>
            <Transition.Child
                as={Fragment}
                enter='ease-out duration-500'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-500'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
            >
                <div
                    className='
                        fixed
                        inset-0
                        bg-black
                        bg-opacity-40
                    '
                >

                </div>
            </Transition.Child>

            <div
                className='
                    fixed
                    inset-0
                    overflow-hidden
                '
            >
                <div
                    className='
                    absolute
                    inset-0
                    overflow-hidden'
                >
                    <div
                        className='
                            pointer-events-none
                            fixed
                            inset-y-0
                            right-0  
                            flex
                            max-w-full
                            pl-10
                        '
                    >
                        <Transition.Child
                            as={Fragment}
                            enter='transform transition ease-in-out duration-500'
                            enterFrom='translate-x-full'
                            enterTo='translate-x-0'
                            leave='transform transition ease-in-out duration-500'
                            leaveTo='translate-x-full'
                        >
                           <Dialog.Panel
                            className="
                                pointer-events-auto
                                w-screen
                                max-w-md

                            "
                           >
                                <div
                                    className='
                                        flex
                                        h-full
                                        flex-col
                                        overflow-y-scroll
                                        bg-[#283e5d]/60
                                        py-6
                                        shadow-xl
                                    '
                                >
                                    <div className="px-4 sm:px-6">
                                        <div
                                            className='
                                                flex
                                                items-start
                                                justify-end
                                            '
                                        >
                                            <div
                                                className='
                                                ml-3
                                                flex
                                                h-7
                                                items-center'
                                            >
                                                <button
                                                    onClick={onClose}
                                                    type='button'
                                                    className='
                                                        text-[#a28c70]
                                                        hover:text-[#e8c179]
                                                        transition
                                                        cursor-pointer
                                                        animate-[pointer_400ms_infinite]
                                                        relative
                                                        group
                                                    '
                                                >
                                                    <span className='sr-only'>Close panel</span>
                                                    <BlurGlow
                                                        outlineColor="#3e204a"
                                                        bgColor="#d0a24e"
                                                    />
                                                    <IoIosCloseCircleOutline size={25} />

                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="
                                    relativ mt-8 
                                    flex-1 px-4 
                                    sm:px-6">
                                        <div className='
                                            flex flex-col items-center
                                        '>
                                            <div className="mb-2">
                                            {data.isGroup ? (
                                                <AvatarGroup users={data.users} />
                                            ):
                                                <Avatar user={otherUser} />
                                            }
                                            </div>
                                            <div className='font-pixel text-2xl'>
                                                {title}
                                            </div>
                                            <div className='
                                                text-sm text-gray-500
                                            '>
                                                {statusText}
                                            </div>
                                            <div className="flex gap-10 my-8">
                                                {/* button to delete our conversation */}
                                                <div
                                                    onClick={() => setisConfrimModalOpen(true)}
                                                    className='
                                                        flex
                                                        flex-col
                                                        gap-3
                                                        items-center
                                                        cursor-pointer
                                                        animate-[pointer_400ms_infinite]
                                                        hover:opacity-75
                                                    '
                                                >
                                                    <div
                                                        className='
                                                            w-10
                                                            h-10
                                                            bg-neutral-100/30
                                                            rounded-full
                                                            flex
                                                            items-center
                                                            justify-center
                                                        '
                                                    >
                                                        <IoIosTrash
                                                            className='text-red-500' size={20}
                                                        />
                                                    </div>
                                                    <div
                                                        className='
                                                            text-sm
                                                            font-light
                                                            text-red-500
                                                        '
                                                    >
                                                        Delete
                                                    </div>
                                                </div>
                                            </div>
                                            {/*  */}
                                            <div
                                                className='
                                                    w-full pb-5
                                                    pt-5
                                                    sm:px-0
                                                    sm:pt-0
                                                '
                                            >
                                                <dl
                                                    className='
                                                    space-y-8
                                                    px-4
                                                    sm:space-y-6 
                                                    sm:px-6
                                                    '
                                                >
                                                    {/* we are going to show this variable only if we arenot in a group chat */}
                                                    {!data.isGroup && (
                                                        <div>
                                                            <dt
                                                                className='
                                                                    text-sm
                                                                    font-medium
                                                                    text-white/50
                                                                    sm:w-40
                                                                    sm:flex-shrink-0
                                                                '
                                                            >
                                                                Email
                                                            </dt>
                                                            <dd
                                                                className='
                                                                    mt-1
                                                                    text-sm
                                                                    sm:col-span-2
                                                                '
                                                            >
                                                                {otherUser.email}
                                                            </dd>

                                                        </div>
                                                    )}

                                                    {/* for Group */}
                                                    <div>
                                                        <dt
                                                            className='
                                                                text-sm
                                                                font-medium
                                                                text-white/70
                                                                sm:w-40
                                                                sm:flex-shrink-0
                                                            '
                                                        >
                                                            Emails
                                                        </dt>
                                                        <dd
                                                            className='
                                                                mt-1
                                                                text-sm
                                                                text-white
                                                                sm:col-spawn-2
                                                                
                                                            '
                                                        >
                                                            {data.users.map((user) => user.email).join(`, `)}
                                                        </dd>    
                                                    </div>        

                                                    {/* for non group */}
                                                    {!data.isGroup && (
                                                        <>
                                                            <hr />
                                                            <div>
                                                                <dt
                                                                    className='
                                                                        text-sm
                                                                        font-medium
                                                                        text-white/50
                                                                        sm:w-40
                                                                    '
                                                                >
                                                                    Joined
                                                                </dt>
                                                                <dd
                                                                    className='
                                                                        mt-1
                                                                        text-sm
                                                                        sm:col-sapn-2
                                                                    '
                                                                >
                                                                    <time dateTime={joinedDate}>
                                                                        {joinedDate}
                                                                    </time>
                                                                </dd>
                                                            </div>
                                                        </>
                                                    )}
                                                </dl>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel> 
                        </Transition.Child>
                    </div>
                </div>
            </div>
        </Dialog>
    </Transition.Root>
    </>
  )
}

export default ProfileDrawer;