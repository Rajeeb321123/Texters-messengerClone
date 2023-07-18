'use client'

import Pusher, { Members, PresenceChannel, Channel } from "pusher-js";
import { pusherClient } from "@/app/libs/pusher";
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { MdCallEnd } from 'react-icons/md';
import { BiCamera, BiCameraOff } from 'react-icons/bi'


import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../Modal";


const ICE_SERVERS = {
  // you can add TURN servers here too
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80'
    },
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun2.l.google.com:19302',
    },
  ],
}


interface VideocallProps {
  roomName: string;
  isOpen: boolean;

};

const VideoCallModal: React.FC<VideocallProps> = ({
  roomName,
  isOpen,

}) => {


  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [userConnected, setUserConnected] = useState<boolean>(false);

  const host = useRef(false);
  const router = useRouter();



  // Pusher specific refs
  const pusherRef = useRef<Pusher>();
  const channelRef = useRef<PresenceChannel>();
  const [activeChannel, setActiveChannel] = useState<PresenceChannel | null>(null);


  // WebRTC ref
  const rtcConnection = useRef<RTCPeerConnection | null>();
  const userStream = useRef<MediaStream>();

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      // presence- is must before name otherwise it wont recognize
      channel = pusherClient.subscribe(`presence-${roomName}`) as PresenceChannel;
      setActiveChannel(channel);
    };

    channelRef.current = channel;

    pusherRef.current = pusherClient;

    channelRef.current.bind(
      'pusher:subscription_succeeded',
      (members: Members) => {
        if (members.count === 1) {
          // when subscribing, if you are the first member, you are the host
          host.current = true
        }

        // example only supports 2 users per call
        if (members.count > 2) {
          // 3+ person joining will get sent back home
          // Can handle however you'd like
          router.push('/')
        }
        handleRoomJoined()
      }
    );

    // when a member leaves the chat
    channelRef.current.bind("pusher:member_removed", handlePeerLeaving);

    channelRef.current.bind('client-ready', () => {
      initiateCall()
    });

    channelRef.current.bind(
      'client-offer',
      (offer: RTCSessionDescriptionInit) => {
        // offer is sent by the host, so only non-host should handle it
        if (!host.current) {
          handleReceivedOffer(offer)
        }
      }
    );

    channelRef.current.bind(
      'client-answer',
      (answer: RTCSessionDescriptionInit) => {
        // answer is sent by non-host, so only host should handle it
        if (host.current) {
          handleAnswerReceived(answer as RTCSessionDescriptionInit)
        }
      }
    );

    channelRef.current.bind(
      'client-ice-candidate',
      (iceCandidate: RTCIceCandidate) => {
        // answer is sent by non-host, so only host should handle it
        handlerNewIceCandidateMsg(iceCandidate)
      }
    )

      

  }, [roomName]);

  const handleRoomJoined = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 },
      })
      .then((stream) => {
        /* use the stream */
        userStream.current = stream
        userVideo.current!.srcObject = stream
        userVideo.current!.onloadedmetadata = () => {
          userVideo.current!.play()
        }

        // for non-host 
        if (!host.current) {
          // the 2nd peer joining will tell to host they are ready
          console.log('triggering client ready')
          channelRef.current!.trigger('client-ready', {})
        }
      })
      .catch((err) => {
        /* handle the error */
        console.log(err)
      })
  };

  const initiateCall = () => {
    if (host.current) {
      rtcConnection.current = createPeerConnection()
      // Host creates offer
      userStream.current?.getTracks().forEach((track) => {
        rtcConnection.current?.addTrack(track, userStream.current!);
      });
      rtcConnection
        .current!.createOffer()
        .then((offer) => {
          rtcConnection.current!.setLocalDescription(offer)
          // 4. Send offer to other peer via pusher
          // Note: 'client-' prefix means this event is not being sent directly from the client
          // This options needs to be turned on in Pusher app settings
          channelRef.current?.trigger('client-offer', offer)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const createPeerConnection = () => {
    // We create a RTC Peer Connection
    const connection = new RTCPeerConnection(ICE_SERVERS)

    // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
    connection.onicecandidate = handleICECandidateEvent

    // We implement our onTrack method for when we receive tracks
    connection.ontrack = handleTrackEvent
    connection.onicecandidateerror = (e) => console.log(e)
    return connection
  };



  const handleReceivedOffer = (offer: RTCSessionDescriptionInit) => {
    rtcConnection.current = createPeerConnection()
    userStream.current?.getTracks().forEach((track) => {
      // Adding tracks to the RTCPeerConnection to give peer access to it
      rtcConnection.current?.addTrack(track, userStream.current!)
    })

    rtcConnection.current.setRemoteDescription(offer)
    rtcConnection
      .current.createAnswer()
      .then((answer) => {
        rtcConnection.current!.setLocalDescription(answer)
        channelRef.current?.trigger('client-answer', answer)
      })
      .catch((error) => {
        console.log(error)
      })

  };

  const handleAnswerReceived = (answer: RTCSessionDescriptionInit) => {
    rtcConnection
      .current!.setRemoteDescription(answer)
      .catch((error) => console.log(error))
  };

  const handleICECandidateEvent = async (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      // return sentToPusher('ice-candidate', event.candidate)
      channelRef.current?.trigger('client-ice-candidate', event.candidate)
    }
  };

  const handlerNewIceCandidateMsg = (incoming: RTCIceCandidate) => {
    // We cast the incoming candidate to RTCIceCandidate
    const candidate = new RTCIceCandidate(incoming)
    rtcConnection
      .current!.addIceCandidate(candidate)
      .catch((error) => console.log(error))
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    partnerVideo.current!.srcObject = event.streams[0]
  };

  const handlePeerLeaving = () => {
    host.current = true
    if (partnerVideo.current?.srcObject) {
      ; (partnerVideo.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop()) // Stops receiving all track of Peer.
    }

    // Safely closes the existing connection established with the peer who left.
    if (rtcConnection.current) {
      rtcConnection.current.ontrack = null
      rtcConnection.current.onicecandidate = null
      rtcConnection.current.close()
      rtcConnection.current = null
    }
  };

  const leaveRoom = () => {
    // socketRef.current.emit('leave', roomName); // Let's the server know that user has left the room.

    if (userVideo.current!.srcObject) {
      ; (userVideo.current!.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop()) // Stops sending all tracks of User.
    }
    if (partnerVideo.current!.srcObject) {
      ; (partnerVideo.current!.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop()) // Stops receiving all tracks from Peer.
    }

    // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
    if (rtcConnection.current) {
      rtcConnection.current.ontrack = null
      rtcConnection.current.onicecandidate = null
      rtcConnection.current.close()
      rtcConnection.current = null
    }


    router.push("/");
  }

  const toggleMic = () => {
    toggleMediaStream('audio', micActive)
    setMicActive((prev) => !prev)
  }

  const toggleCamera = () => {
    toggleMediaStream('video', cameraActive)
    setCameraActive((prev) => !prev)
  }

  const toggleMediaStream = (type: 'video' | 'audio', state: boolean) => {
    userStream.current!.getTracks().forEach((track) => {
      if (track.kind === type) {
        track.enabled = !state
      }
    })
  }




  return (

    <Modal
      isOpen={isOpen}
      onClose={leaveRoom}
      closeButton={false}
      videoCall={true}
    >

      <div >
        <div 
          className="
            min-h-[75vh] 
            md:min-h-[80vh] 
            min-w-[100vh]
          "
          >
            <video 
              className="
                absolute
                right-0
                bottom-0
                min-w-[100%]
                min-h-[100%]
                w-auto
                h-auto
                overflow-hidden
                object-fill
              "
              autoPlay 
              ref={partnerVideo} 
              
            />
          

            <video 
              className="
                absolute
                right-0
                top-0
                min-w-[20%]
                min-h-[20%]
                max-w-[20%]
                max-h-[20%]
                lg:max-h-[30%]
                lg:min-h-[30%]
                object-fill
                h-auto
                w-auto
                overflow-hidden
                shadow-md shadow-black/50
                border-gray-700/50
                hover:scale-110
              "
              autoPlay 
              ref={userVideo}
              muted  
            />
          

          <div className=" absolute inset-x-0 bottom-3  mx-auto ">
            <div
              className="
                flex 
                gap-10
                justify-center
                px-2
                py-2
              "
            >
              <button onClick={toggleMic} type="button" className="bg-gray-700/50 rounded-full hover:scale-110">
                {micActive ? <BsFillMicFill className="p-1" size={30} /> : <BsFillMicMuteFill className="p-1" size={30} />}
              </button>
              <button onClick={leaveRoom} type="button" className="bg-gray-700/50 text-red-500 rounded-full hover:scale-110">
                <MdCallEnd className="p-1" size={30} />
              </button>
              <button onClick={toggleCamera} type="button" className="bg-gray-700/50  rounded-full hover:scale-110">
                {cameraActive ? <BiCamera className="p-1" size={30} /> : <BiCameraOff className="p-1" size={30} />}
              </button>
            </div>
          </div>



        </div>
      </div>
    </Modal>
  );

}

export default VideoCallModal;