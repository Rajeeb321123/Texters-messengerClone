'use client';

import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IoIosCloseCircleOutline, IoIosTrash } from 'react-icons/io';
import BlurGlow from './BlurGlow';

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="
                            fixed 
                            inset-0 
                            bg-[#1b3347]
                            bg-opacity-40 
                            transition-opacity
                        "
                    />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div
                        className="
                            flex 
                            min-h-full 
                            items-center 
                            justify-center 
                            p-4 
                            text-center 
                            sm:p-0
                            "
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="
                                        relative 
                                        transform 
                                        overflow-hidden 
                                        rounded-lg 
                                        bg-black
                                        px-4 
                                        pb-4
                                        pt-5 
                                        text-left 
                                        shadow-xl 
                                        transition-all
                                        w-full
                                        sm:my-8 
                                        sm:w-full 
                                        sm:max-w-lg 
                                        sm:p-6
                                    "
                            >
                                <div
                                    className="
                                        absolute 
                                        right-0 
                                        top-0 
                                        hidden 
                                        pr-4 
                                        pt-4 
                                        sm:block
                                        z-10
                                        bg-black
                                    "
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
                                        <IoIosCloseCircleOutline  aria-hidden="true" size={25} />

                                    </button>
                                </div>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Modal;