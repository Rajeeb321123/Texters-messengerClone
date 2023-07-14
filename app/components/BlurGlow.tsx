'use client';

interface BlurGlowProps {
    outlineColor: string;
    bgColor: string;
}

const BlurGlow:React.FC<BlurGlowProps> = ({
    outlineColor,
    bgColor
}) => {
    return (
        <>
        <div
            className={`
            absolute
            top-0
            left-[-1px]
            blur
            rounded-full
            bg-[${bgColor}]/50
            w-full
            h-full
            outline-double
            outline-8
            outline-[${outlineColor}]
                `
            }
            
            >
            &nbsp;
        </div> 
        </>
        
    )
}

export default BlurGlow