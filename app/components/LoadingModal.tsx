"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Loader from "./Loader";

const LoadingModal = () => {
  return (
    <Transition.Root show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in durtion-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="
                fixed
                inset-0
                bg-black            
                bg-opacity-50
                transtion-opacity
            "
          />
        </Transition.Child>
        <div
          className="
                fixed
                inset-0
                z-10
                overflow-y-auto
            "
        >
            <div 
             className="c
                flex
                min-h-full
                items-center
                justify-center
                p-4
                text-center
             "
            >
                <Dialog.Panel>
                    <Loader />
                </Dialog.Panel>
            </div>

        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default LoadingModal;
