// hook to just to return params of  currnet active conversationId from url if exist

import { useParams } from "next/navigation";
import { useMemo } from 'react';

const useConversation = () => {
    const params = useParams();

    const conversationId = useMemo(() => {
        if (! params?. conversationId) {
            return'';
        };

        return params.conversationId as string;
    },[params?.conversationId]);

    // !! make sure isOpen is a type of string not a string
    const isOpen = useMemo(() => !!conversationId, [conversationId]);

    return useMemo(() => ({
        isOpen,
        conversationId,
    }),[isOpen, conversationId]);

};

export default useConversation;