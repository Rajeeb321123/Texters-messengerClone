'use client';

// make sure to put it into most root layout of app folder

import useActiveChannel from "../hooks/useActiveChannel";

const ActiveStatus = () => {
    useActiveChannel();
    return null;
};

export default ActiveStatus;

