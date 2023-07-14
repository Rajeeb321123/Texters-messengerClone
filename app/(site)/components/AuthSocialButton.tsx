'use client';

import { IconType } from "react-icons";

interface AuthSocialButtonProps {
    icon: IconType,
    onClick: () => void;
    disabled?: boolean;
};
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { FaFacebookSquare } from 'react-icons/fa'



const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
    icon: Icon,
    onClick,
    disabled
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            //learn about inline-flex : very useful 
            className={`
            inline-flex
            w-full
            justify-center
            rounded-md
            relative
            px-4
            mx-1
            py-2
            text-white
            shadow-sm
            ring-1
            ring-gray-300
            cursor-pointer
            animate-[pointer_400ms_infinite]
            ${!disabled ? `hover:bg-[#212121]
            focus:outline-offset-0
            hover:-translate-y-1
            hover:scale-95`: ''}
            
        `}

        >
            <Icon
                className="z-10"
            />
            {Icon === BsGoogle && !disabled && (
                <div
                    className="
                    absolute 
                    top-0  
                    h-full 
                    w-full 
                    grid 
                    grid-cols-4 
                    group 
                    "
                >
                    <div className=' animate-[wave1_2s_ease-in-out_infinite] group-hover:animate-none  rounded-l-md bg-[#4285F4] group-hover:-translate-y-0.5 '>
                        &nbsp;
                    </div>
                    <div className='animate-[wave2_2s_ease-in-out_infinite] group-hover:animate-none bg-[#EA4335] group-hover:-translate-y-1'>
                        &nbsp;
                    </div>
                    <div className='animate-[wave3_2s_ease-in-out_infinite] group-hover:animate-none bg-[#FBBD05] group-hover:-translate-y-2'>
                        &nbsp;
                    </div>
                    <div className='animate-[wave4_2s_ease-in-out_infinite] group-hover:animate-none  rounded-r-md bg-[#34AB53] group-hover:-translate-y-1'>
                        &nbsp;
                    </div>
                </div>
            )}

            {Icon === BsGithub && !disabled && (
                <div 
                className="
                    absolute
                    top-0  
                    h-full 
                    w-full 
                    grid 
                    grid-cols-4 
                    group 
                ">

                    <div className=' animate-[wave1_2s_ease-in-out_infinite] group-hover:animate-none rounded-l-md bg-[#4D4D4D] group-hover:-translate-y-0.5'>
                        &nbsp;
                    </div>
                    <div className='animate-[wave2_2s_ease-in-out_infinite] group-hover:animate-none bg-[#363636] group-hover:-translate-y-1'>
                        &nbsp;
                    </div>
                    <div className='animate-[wave3_2s_ease-in-out_infinite] group-hover:animate-none bg-[#212121] group-hover:-translate-y-2'>
                        &nbsp;
                    </div>
                    <div className=' animate-[wave4_2s_ease-in-out_infinite] group-hover:animate-none rounded-r-md bg-[#636363] group-hover:-translate-y-1'>
                        &nbsp;
                    </div>
                </div>
            )}

            {Icon === FaFacebookSquare && !disabled && (
                <div className="
                    absolute 
                    top-0  
                    h-full 
                    w-full 
                    grid 
                    grid-cols-4 
                    group 
                ">

                    <div className='animate-[wave1_2s_ease-in-out_infinite] group-hover:animate-none rounded-l-md bg-[#ffffff] group-hover:-translate-y-0.5'>
                        &nbsp;
                    </div>
                    <div className='animate-[wave2_2s_ease-in-out_infinite] group-hover:animate-none bg-[#3a5998] group-hover:-translate-y-1'>
                        &nbsp;
                    </div>
                    <div className='animate-[wave3_2s_ease-in-out_infinite] group-hover:animate-none bg-[#8b9dc3] group-hover:-translate-y-2'>
                        &nbsp;
                    </div>
                    <div className='animate-[wave4_2s_ease-in-out_infinite] group-hover:animate-none rounded-r-md bg-[#dfe3ee] group-hover:-translate-y-1'>
                        &nbsp;
                    </div>
                </div>
            )}
        </button>
    )
}

export default AuthSocialButton