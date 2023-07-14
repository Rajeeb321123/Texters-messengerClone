"use client";

import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";

import useConversation from "@/app/hooks/useConversation";
import MessageInput from "./MessageInput";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";

const Form = () => {
    const { conversationId } = useConversation();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            message: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        // clearing the message value on onSubmit
        setValue("message", "", { shouldValidate: true });
        axios.post("/api/messages", {
            ...data,
            conversationId: conversationId,
        });
    };

    // for image Upload as message
    const handleUpload = (result: any) => {
        axios.post('/api/messages', {
            image: result?.info?.secure_url,
            conversationId
        })
    }

    return (
        <div
            className="
            py-4
            px-4
            border-t
            lg:border-l
            lg:rounded-l-md
            lg:border-r
            lg:rounded-r-md
            flex
            items-center
            gap-2
            lg:gap-4
            w-full
            
        "
        >
            <CldUploadButton
                options={{maxFiles: 1}}
                onUpload={handleUpload}
                uploadPreset="TexterApp"
            >
                <div
                    className="
                h-[35px]
                lg:h-[40px] 
                lg:w-[40px] 
                w-[35px]
                aspect-square
                relative
                overflow-hidden
                "
                >
                    <Image alt="gallery" src="/images/gallery.png" fill />
                </div>
            </CldUploadButton>
            <form
                // handleSubmit will provide data from this form  to onSubmit we created
                onSubmit={handleSubmit(onSubmit)}
                className="
                flex items-center gap-2
                lg:gap-4 w-full
            "
            >
                <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Write a message"
                />
                {/* button for submitting the form */}
                <button
                    type="submit"
                    className="
                    rounded-full
                    bg-[#623146]/70
                    hover:bg-[#623146]
                    
                "
                >
                    <div
                        className="
                            h-[35px]
                            lg:h-[40px] 
                            lg:w-[40px] 
                            w-[35px]
                            aspect-square
                            relative
                            overflow-hidden
                            rotate-90
                        "
                    >
                        <Image alt="gallery" src="/images/rocket.png" fill />
                    </div>
                </button>
            </form>
        </div>
    );
};

export default Form;
