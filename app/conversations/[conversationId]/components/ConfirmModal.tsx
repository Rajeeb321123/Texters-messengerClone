'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

import Modal from "@/app/components/Modal";
import useConversation from "@/app/hooks/useConversation";
import { Dialog } from "@headlessui/react";
import Button from "@/app/components/Button";

interface ConfirmModalProps {
    isOpen?: boolean;
    onClose: () => void;
};


const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
}) => {
    const router = useRouter();
    const { conversationId }=  useConversation();
    const [isLoading, setIsLoading] = useState(false);

    // delete method
    const onDelete = useCallback(() => {
        setIsLoading(true);

        axios.delete(`/api/conversations/${conversationId}`)
        .then(() => {
            onClose();
            router.push('/conversations');
            router.refresh();
        })
        .catch(() => toast.error('Something went wrong'))
        .finally(() => setIsLoading(false));

    },[]);
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
    >
        <div className=" sm:flex sm:items-start">
            <div
                className="
                    mx-auto 
                    flex 
                    h-12 
                    w-12 
                    flex-shrink-0 
                    items-center 
                    justify-center 
                    rounded-full 
                    sm:mx-0 
                    sm:h-10 
                    sm:w-10
                "
            >
                <FiAlertTriangle 
                    className="h-6 w-6  text-pixel text-red-600"
                />
            </div>
            <div
                className="
                    mt-3
                    text-center
                    sm:ml-4
                    sm:mt-0
                    sm:text-left
                "
            >
                <Dialog.Title
                    as='h3'
                    className="
                        text-3xl
                        font-semibold
                        leading-6
                        font-pixel

                    "
                 >
                    Delete Conversation
                </Dialog.Title>
                <div className="mt-2">
                    <p className=" text-sm text-red-300">
                    Are you sure you want to delete this conversation? 
                    </p>
                </div>
            </div>
        </div>
        <div
            className="
                mt-5
                sm:mt-4
                
                flex
                flex-row-reverse
                justify-center
                sm:justify-start
            "
        >
            <Button
                disabled={isLoading}
                danger
                onClick={onDelete}
            >
                Delete
            </Button>
            <Button
                disabled={isLoading}
                secondary
                onClick={onClose}
            >
                Cancel
            </Button>
        </div>
    </Modal>
  )
}

export default ConfirmModal;