'use client';
// for logo

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface LogoProps {
    size: number;
}

const Logo: React.FC<LogoProps> = ({
    size
}) => {

    const [isGigLogo, setIsGigLogo] = useState(true);
    const [isBounceLogo, setIsBounceLogo] = useState(0);
    const [isDisabled, setIsDisabled] = useState(true);
    

    // USE REF and ADDEVENTLISTENER
    // trying to useRef rather than easy way for just learning, use setTimeout for bounce element in real case
    const ref1 = useRef<HTMLButtonElement>(null);
    // for handling bounce on Click : harder way by using addEventListener: just for learning purpose
    const handleBounce =(e:any)=>{
        e.preventDefault;
                
        // -> removing the class
        console.log('inside addEventListener');
        if (ref1.current) {

            ref1.current.classList.remove("animate-[bounce_1s_ease-in-out_8]");
            
            
            
            // -> triggering reflow /* The actual magic */
            // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
            ref1.current.offsetWidth;
            
            // -> and re-adding the class
            ref1.current.classList.add("animate-[bounce_1s_ease-in-out_8]");
            setIsBounceLogo(2);
        };
    };

    // sala valla talla infinite loop bata mukti paiyo: took 5 hrs on this shitty useEffect infinite loop problem
    // solution for infinte loop : use Dependencies very carefully ,structure your code carefully, use minimum setState() inside useEffect  and MOST IMP: use if clause or any conditionals
    useEffect(() => {
        if (isGigLogo && setIsDisabled) {
        
             
        if(ref1.current !== null) {

            ref1.current.addEventListener('click', handleBounce, false);
        }
            // for breaking the infinite loop if it happens
            if( !isGigLogo){
                return;
            };

            let timer1 = setTimeout(() => setIsGigLogo(false), 5300);
            return () => {
                clearTimeout(timer1);
                if(ref1.current !== null && isBounceLogo >= 2) {
                    
                    ref1.current.removeEventListener('click', handleBounce, false);
                };
                setIsDisabled(false);
                
            };
        }
    }, [isGigLogo]);

    return (
        <button
            className="
            
                ml-auto
                mr-auto
                items-center
            "
            ref={ref1}
            disabled={isDisabled}
            onClick={() => { if(isGigLogo && isDisabled){return};
                setIsGigLogo(true); setIsDisabled(true) 
            }}
        >
            <Image
                alt="Logo"
                height={size}
                width={size}
                className={`ml-auto mr-auto rounded-2xl animate-[bounce_1s_ease-in-out_8]`}
                src={isGigLogo ? `/images/logo-nobg.gif` : `/images/logo-nobg.png`}
            />
        </button>
    );
};

export default Logo