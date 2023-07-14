'use client';

import Modal from "@/app/components/Modal";
import { Modak } from "next/font/google";
import Image from "next/image";

interface ImageMdoalProps {
    src: string | null;
    isOpen?: boolean;
    onClose: () => void;
};

const ImageModal:React.FC<ImageMdoalProps> = ({
    isOpen,
    onClose,
    src
}) => {
    if (!src) {
        return null;
    };



  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-80 h-80">
            <Image 
                alt='Image'
                className='object-cover'
                src={src}
                fill
            />
        </div>
    </Modal>
  )
}

export default ImageModal