'use client';

// MOdal for opening the VideoCall.tsx


import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Modal from "../Modal";
import Input from "../inputs/Input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";

interface SettingModalProps {
    isOpen?: boolean;
    onClose: () => void;
    setRoomName: (value: string) => void;
    setIsVideoCallOpen: () => void;
    
};



const SettingModal: React.FC<SettingModalProps> = ({
    isOpen,
    onClose,
    setRoomName,
    setIsVideoCallOpen
    
}) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            
        }
    });

   

 

    const onSubmit: SubmitHandler<FieldValues> = (data) => {

        setRoomName(data.name);
        setIsVideoCallOpen();
        onClose();

        
    }


  return (
    <Modal
        isOpen={isOpen} onClose={onClose}
    >
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
                <div className=" border-b border-white pb-12">
                    <h2
                        className="
                            text-3xl
                            leading-7
                            font-pixel
                            text-white
                        "
                    >
                        VideoCall Room
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-white/70 ">
                        Room you want to join or create. No spaces please
                    </p>
                    <div className="
                            mt-10
                            flex
                            flex-col
                            gap-y-8
                        "
                    >
                        <Input 
                            disabled = {isLoading}
                            label="RoomName"
                            id="name"
                            errors={errors}
                            required
                            register={register}
                        />
                        
                    </div>
                </div>

                <div
                    className="
                        mt-6
                        flex
                        items-center
                        justify-end
                        gap-x-6
                    "
                >
                    <Button
                       
                        secondary
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        
                        type="submit"
                    >
                        Create or Join the room
                    </Button>
                    <div>

                    </div>
                </div>
            </div>
        </form>
    </Modal>
  )
}

export default SettingModal;