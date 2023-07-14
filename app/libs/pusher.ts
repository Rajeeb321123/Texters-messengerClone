// PUSHER LIBS : for real time communication

import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
    // here ! ensure env are string 
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: 'ap2',
    // Transport Layer Security (TLS) encrypts data sent over the Internet to ensure against eavesdroppers and hackers 
    useTLS: true,
});

export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
        //Object containing the configuration for user authorization. Puser-js docs
        channelAuthorization: {
            endpoint: '/api/pusher/auth',
            transport: 'ajax'
        },
        cluster: 'ap2'
    }
);