'useclient';

import clsx from "clsx";
import Link from "next/link";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick}>
      <Link 
        href={href}
        className={clsx(`
          group
          glex
          gap-x-3
          rounded-md
          p-3
          text-sm
          leading-6
          font-semibold
          text-gray-500
          hover:text-white
          cursor-pointer
          animate-[pointer_400ms_infinite]
         
        `,
          active && ' text-white'
        )}
      >
        <Icon className=" h-6 w-6 shrink-0 "/>
        {/* sr only make it visible in only server side rendering */}
        <span className="font-pixel text-xl sr-only ">{label}</span>
      </Link>
    </li>
  )
}

export default DesktopItem