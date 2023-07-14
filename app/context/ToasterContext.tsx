// Our toast or alert box context

import  { Toaster } from 'react-hot-toast';

const ToasterContext = () => {
    return (
        <div className='absolute'>

        <Toaster />
        </div>
    );
};

export default ToasterContext;