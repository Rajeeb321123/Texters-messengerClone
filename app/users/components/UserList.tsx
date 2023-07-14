'use client';

import { User } from '@prisma/client';
import Image from 'next/image';
import UserBox from './UserBox';

interface UserListProps {
    items: User[];
}

const UserList: React.FC<UserListProps> = ({
    items,
}) => {
    return (
        <aside
            className='
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

        '
        >


            <Image
                
                alt='scifiborder'
                className='sticky top-0 h-full w-full hidden lg:block opacity-50 z-[-90]'
                fill
                src='/images/scifiborder1.png'
            />
           


            <div className='px-5'>
                <div className='flex-col'>
                    <div className='
                    text-2xl
                    font-bold
                    text-white
                    py-4
                '>
                        People
                    </div>
                </div>
                {items.map((item) => (
                    <UserBox 
                        key={item.id}
                        data={item}
                    />
                ))}

            </div>
        </aside>
    )
}

export default UserList;