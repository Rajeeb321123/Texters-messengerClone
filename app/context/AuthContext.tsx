'use client';

// creating the session for our user
// Using the supplied <SessionProvider> allows instances of useSession() to share the session object across components, by using React Context under the hood. It also takes care of keeping the session updated and synced between tabs/windows.

import { SessionProvider } from "next-auth/react";

interface AuthContextProps {
    children: React.ReactNode;
};

export default function AuthContext({
    children
}: AuthContextProps ) {
    return <SessionProvider>
        {children}
    </SessionProvider>
};
