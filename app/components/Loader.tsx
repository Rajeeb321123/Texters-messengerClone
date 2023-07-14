'use client';

import Image from "next/image";



const Loader = () => {
  return (
    <>
     <div
        className=" 
        mt-auto
        mr-auto
        ml-auto
        mb-auto 
        "       
    >

        <Image
            priority
            src='/images/loading.gif'
            alt='loading'
            height='200'
            width='250'
        />
        <p
            className="
                inline
                font-pixel
                font-bold
                text-[#e28743]
                text-3xl
                lg:text-4xl
                
            "
        >
            L O A D I N G 
        </p>
        <p
            className="
                inline
                font-pixel
                font-bold
                text-3xl
                text-[#e28743]
                lg:text-4xl
            "
        >
        &nbsp; &#9658; &#9658; &#9658;
        </p>
    </div>
    </>
  )
}

export default Loader