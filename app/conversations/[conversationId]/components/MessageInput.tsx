'use client';

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
    placeholder?: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

const MessageInput:React.FC<MessageInputProps> = ({
    placeholder,
    id,
    type,
    register,
    required,
    errors,
}) => {

  return (
    <div className="relative w-full">
        <input 
            id={id}
            type={type}
            autoComplete={id}
            {...register( id, {required: required} )}
            placeholder={placeholder}
            className="
                text-white
                font-light
                py-2
                px-4
                bg-[#283e5d]/60
                w-full
                rounded-full
                focus:outline-none
            "
        />
    </div>
  )
}

export default MessageInput