'use client';


// MOST IMP PART OF PROJECT: USE OF PUSHER FOR REALTIME CHAT

//main body of conversation page
import { useState,useRef, useEffect } from 'react';
import axios from 'axios';
import { find } from 'lodash';


import { FullMessageType } from "@/app/types";
import useConversation from '@/app/hooks/useConversation';
import MessageBox from './MessageBox';
import { pusherClient } from '@/app/libs/pusher';

interface BodyProps {
  initialMessages:  FullMessageType[];
};

const Body:React.FC<BodyProps> = ({
  initialMessages
}) => {
  const [messages, setMessages] = useState(initialMessages);
  
  // VERY IMP: auto scroll
  // when we get new message we scroll down using ref
  const bottomRef = useRef<HTMLDivElement>(null);

  // extracting the conversationId
  const { conversationId } = useConversation();

  // for every time we load this page we are going to load seen to last message through api call
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)

  }, [conversationId]);

  // VERY VERY IMP: PUSHER-SERVER
  useEffect(() => {

    // conversationId is the channel: Anyone listening to this channel will get getupdated messages
    pusherClient.subscribe(conversationId);

    // we are getting message from pusher
    const messageHandler = (message: FullMessageType) => {

      // alert everyone we have seen that message
      axios.post(`/api/conversations/${conversationId}/seen`)


      // current is the current messages we have before new message is pushed
      setMessages((current) => {
        
        // finding any message that has already the same messageid
        // using special query of { id: message.id }
        // so we dont accidently make duplicate message 
        // find is from lodash. Lodash makes JavaScript easier by taking the hassle out of working with arrays, numbers, objects, strings, etc.
        if (find(current, { id: message.id })) {
          return current;
        };

        // setting the new messages array
        return  [...current, message];
      });

      // every time we subscribe to new messages we have to scroll down
      bottomRef?.current?.scrollIntoView();

    };

    // handler for seen of message
    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessaage) => {
        // replacing the old message with new message
        if (currentMessaage.id === newMessage.id) {
          return newMessage;
        };

        // ohterwise return the current message
        return currentMessaage;
      }));

    };

    
    // bind the pusher client to expect the key or event for new messages: 
    pusherClient.bind('messages:new', messageHandler)

    // bind the pusher for seen the message . 
    pusherClient.bind('message:update', updateMessageHandler);

    // we must unbind and unsuscribe every time we unmaunt so we dont get overflow
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('messages:update', updateMessageHandler);

    }
  },[conversationId]);
  

  return (
    <div className="flex-1 overflow-y-auto">
        
        {/* iteratoin of our messages */}
        {messages.map((message,i) =>(
          <MessageBox 
            // is last is for knowing is our the message in iteration the last message 
            isLast = {i === messages.length-1}
            key={message.id}
            data={message}
          />

        ))}

        {/* VERY IMP: auto scroll */}
        {/* just the div for scroll down if message is sent/recieved */}
        <div className='pt-24' ref={bottomRef} /> 



    </div>
  )
}

export default Body