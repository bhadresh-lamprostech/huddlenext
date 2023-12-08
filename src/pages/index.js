import React, { useState } from "react";

import { useEffect } from "react";

import axios from "axios";

import { useHuddle01 } from "@huddle01/react";
import {
  useLobby,
  useAudio,
  useVideo,
  useRoom,
  usePeers,
} from "@huddle01/react/hooks";
import { Audio, Video } from "@huddle01/react/components";

export default function Home() {
  const { initialize, isInitialized } = useHuddle01();
  const { joinLobby } = useLobby();
  const [roomNewId, setRoomNewId] = useState();
  const {
    fetchAudioStream,
    stopAudioStream,
    stream: micStream,
    error: micError,
    produceAudio,
    stopProducingAudio,
  } = useAudio();

  const {
    fetchVideoStream,
    stopVideoStream,
    stream: camStream,
    error: camError,
    produceVideo,
    stopProducingVideo,
  } = useVideo();
  const { joinRoom, leaveRoom } = useRoom();

  const { peerIds } = usePeers();

  useEffect(() => {
    // its preferable to use env vars to store projectId
    initialize("HvlPbVFpIfc-ip_Iq7gmEdE8dJ4wCop7");
  }, []);
  const createRoom = async () => {
    try {
      const response = await axios.post(
        "https://api.huddle01.com/api/v1/create-room",
        {
          title: "Huddle01-Test",
          hostWallets: ["0xB5204aff106dc1Ffc6bE909c94a6A933081dB636"],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
        }
      );

      setRoomNewId(response.data.data.roomId); // Extract roomId from the response

      console.log("Room created with ID:", response.data.data.roomId);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const getRooms = async () => {
    try {
      const responseGetRoom = await axios.get(
        "https://api.huddle01.com/api/v1/get-rooms",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
        }
      );

      console.log(responseGetRoom);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const apiKey = "WDfdwP2ChGv3OmRDbQzKDHeJQd0cTnqk";

  return (
    <div>
      {isInitialized ? "Hello World!" : "Please initialize"}

      <div className="grid grid-cols-4">
        {peerIds &&
          peerIds.map((peerId) => <Video key={peerId} peerId={peerId} debug />)}

        {peerIds &&
          peerIds.map((peerId) => <Audio key={peerId} peerId={peerId} debug />)}
      </div>

      <button
        // disabled={joinLobby.isCallable}
        onClick={() => joinLobby(roomNewId)}
      >
        Join Lobby
      </button>

      {/* Mic */}
      <button
        disabled={!fetchAudioStream.isCallable}
        onClick={fetchAudioStream}
      >
        FETCH_AUDIO_STREAM
      </button>
      <button onClick={() => createRoom()}>create Room</button>

      {/* Webcam */}
      <button
        disabled={!fetchVideoStream.isCallable}
        onClick={fetchVideoStream}
      >
        FETCH_VIDEO_STREAM
      </button>

      <button disabled={!joinRoom.isCallable} onClick={joinRoom}>
        JOIN_ROOM
      </button>

      <button disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
        LEAVE_ROOM
      </button>

      <button
        disabled={!produceVideo.isCallable}
        onClick={() => produceVideo(camStream)}
      >
        Produce Cam
      </button>

      <button
        disabled={!produceAudio.isCallable}
        onClick={() => produceAudio(micStream)}
      >
        Produce Mic
      </button>

      <button
        disabled={!stopProducingVideo.isCallable}
        onClick={stopProducingVideo}
      >
        Stop Producing Cam
      </button>
      <button onClick={() => getRooms()}>Get Rooms</button>

      <button
        disabled={!stopProducingAudio.isCallable}
        onClick={stopProducingAudio}
      >
        Stop Producing Mic
      </button>
    </div>
  );
}
