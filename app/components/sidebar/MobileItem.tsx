'use client';

import Link from "next/link";
import clsx from "clsx";

interface MobileItemProps {
    href: string;
    icon: any;
    active?: boolean
    onClick?: () => void;
};

const MobileItem: React.FC<MobileItemProps> = ({
    href,
    icon: Icon,
    active,
    onClick
}) => {
    const handleClick = () => {
        // if onClick exist on useRoutes items than just return that
        if (onClick) {
            return onClick();
        };
    };


  return (
    <Link 
        href={href}
        onClick={onClick}
        className={clsx(`
            group
            flex
            gap-x-3
            text-sm
            leading-6
            font-semibold
            w-full
            justify-center
            p-4
            text-gray-500
            hover:text-white
            hover:bg-[#23325b]/70
            cursor-pointer
            animate-[pointer_400ms_infinite]
        `,
            active && 'bg-[#1b3347] text-white'
        )}
    >
        <Icon 
            className='h-6 w-6'
        />
    </Link>
  )
}

export default MobileItem