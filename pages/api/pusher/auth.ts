// just for showing active status of people
// VERY VERY IMP

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


// creating the authentication for pusher
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const session = await getServerSession(request, response, authOptions);

    if (!session?.user?.email) {
        return response.status(401);
    };

    // getting the socket
    const sockedId = request.body.socket_id;
    const channel = request.body.channel_name;
    // mapping the userId as current current user Email
    // so we are working with emails for active status 
    const data = {
        user_id: session.user.email
    };

    const authResponse = pusherServer.authorizeChannel(sockedId, channel, data);

    return response.send(authResponse);

}
