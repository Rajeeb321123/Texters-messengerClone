'use client';
// for Text input

// clsx allow us to dynamically use our classes
import clsx from "clsx";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form';


interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
};



const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled
}) => {
  return (
    <div>
      <label htmlFor={id}
        className="
          block
          text-sm
          font-medium
          leading-6
         
        "
      >
        {label}
      </label>
      <div className="">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required: required })}
          // clx
          // form-input is from npm i @tailwindcss/forms
          className={clsx(`
          form-input
          block 
          w-full 
          rounded-md 
          border-0 
          py-1.5 
          text-gray-900 
          shadow-sm 
          ring-1 
          ring-inset 
          ring-gray-300 
          placeholder:text-gray-400 
          focus:ring-2 
          
          focus:ring-sky-600 
          sm:text-sm 
          sm:leading-6
          `,
            // dynamic behaviour by using clsx 
            errors[id] && 'focus:ring-rose-500',
            disabled && 'opacity-50 cursor-pointer animate-[pointer_400ms_infinite]'
          )}
        />

        
      </div>
    </div>
  )
}

export default Input