'use client';

import clsx from "clsx";

interface ButtonProps {
    type?: 'button' | 'submit' | undefined;
    fullwidth?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
    secondary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}
const Button: React.FC<ButtonProps> = ({
    type,
    fullwidth,
    children,
    onClick,
    secondary,
    danger,
    disabled,
}) => {
  return (
    <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={clsx(`
            flex
            justify-center
            rounded-md
            px-3
            py-2
            text-sm
            font-semibold
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-2
            cursor-pointer
            animate-[pointer_400ms_infinite]
        `,
            disabled && "oppacity-50 cursor-default ",
            fullwidth && "w-full",
            secondary ? 'bg-black' : 'text-white',
            danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
            !secondary && !danger && "bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400 hover:to-pink-600 hover:via-purple-600 hover:from-indigo-600 focus-visible:to-pink-900 focus-visible:via-purple-900"
        )}
    >
        {children}
    </button>
  )
}

export default Button