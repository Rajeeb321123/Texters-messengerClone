'use client';

import ReactSelect from 'react-select';

interface SelectProps {
    label: string;
    // IMP:
    // the Record type simply allows us to define dictionaries, also referred to as key-value pairs, with a fixed type for the keys and a fixed type for the values.
    value?: Record<string, any>;
    onChange: (value: Record<string, any>) => void;
    options: Record<string, any>[];
    disabled?: boolean;
};

const Select:React.FC<SelectProps> = ({
    label,
    value,
    onChange,
    options,
    disabled,
}) => {
  return (
    <div className="z-[100]">
        <label
            className="
                block
                text-sm
                font-medium
                leading-6
                
            "
        >
            {label}
        </label>
        <div className="mt-2 text-black">
            <ReactSelect 
                isDisabled={disabled}
                value={value}
                onChange={onChange}
                isMulti
                options={options}
                // reason for using menuPortalTarget: because we zindex overflow as we are in a modal
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: (base) => ({
                        ...base,
                        zIndex:9999
                    })
                }}
                classNames={{
                    control: () => "text-sm ",
                    option: () => 'text-lg ',
                    menuList: () => 'text-black'
                }}
                
            />
        </div>
    </div>
  )
}

export default Select;