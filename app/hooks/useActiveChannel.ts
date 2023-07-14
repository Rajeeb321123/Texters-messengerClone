import { useEffect, useState } from "react";
import useActiveList from "./useActiveList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "../libs/pusher";


const useActiveChannel = () => {
    const { set, add, remove } = useActiveList();
    const  [activeChannel, setActiveChannel] = useState <Channel | null>(null);

    //useEffect function for listening to every person join and leaving the present channel   
    // and set them in global Active list in useActiveList.ts
    useEffect(() => {
        let channel = activeChannel;

        if (!channel) {
            // presence- is must before name otherwise it wont recognize
            channel = pusherClient.subscribe('presence-texters');
            setActiveChannel(channel);
        };


        // INITIAL LOAD OF ACTIVE USERS
        // Members type is from pusher
        // pusher:subscription_succeded is special event in pusher
        channel.bind("pusher:subscription_succeeded", (members: Members) => {
            // what happen with those members
            const initialMembers: string[] = [];

            // iterate those members and push their emails
            // we cant use each forEach here. members is special class from pusher so dont treat it like normal array
            members.each((member: Record<string, any>) => initialMembers.push(member.id));
            // setting the initialMembers in global members array in useActiveList.ts
            set(initialMembers);
        })

        // ADDING THE new users as SINGLE MEMBER
        channel.bind("pusher:member_added", (member: Record<string, any>) => {
            add(member.id)
          });


        // REMOVING users 
        channel.bind("pusher:member_removed", (member: Record<string, any>) => {
            remove(member.id);
          });

        return () => {
            if (activeChannel) {
                pusherClient.unsubscribe('presence-texters')
                setActiveChannel(null);
            };
        }

    },[activeChannel, set, add, remove]);
}

export default useActiveChannel;