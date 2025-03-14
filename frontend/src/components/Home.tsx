import { useState } from "react";
import { useRecoilState } from "recoil";
import { roomIdState, joinedState } from "../../recoil/atoms/roomAtom.ts";
import { socketState } from "../../recoil/atoms/socketAtom.ts";
import { userState } from "../../recoil/atoms/userAtom.ts";

interface User {
  id: string | null;
  name: string | null;
}

const Home = () => {
  const [roomId, setRoomId] = useRecoilState<string>(roomIdState);
  const [currentId, setCurrentId] = useState("");
  const [erroMessage, setErroMessage] = useState("");
  const [socket] = useRecoilState<WebSocket | null>(socketState);
  const [joined, setJoined] = useRecoilState(joinedState);
  const [user, setUser] = useRecoilState<User>(userState);
  const [name, setName] = useState("");

  console.log(joined, user)

  const joinRoom = async () => {
    if (!currentId) {
      setErroMessage("Room ID must be 6 characters long");
      return;
    }
    if (currentId.length < 6) {
      setErroMessage("Room ID must be 6 characters long");
      return;
    }
    if (!name) {
      setErroMessage("Name is required");
      return;
    }

    setRoomId(currentId);
    setErroMessage("");

    if (!socket) {
      console.error("No socket connection!");
      return;
    }

    console.log("Sending join event for room:", currentId);
    const id = name + Math.random().toString(36).substring(2, 8);
    setUser({ id, name });

    socket.send(
      JSON.stringify({
        type: "join",
        payload: { room: currentId, user: { id, name } },
      })
    );

    setJoined(true);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      {/* Header */}
      <p className="text-2xl md:text-4xl font-bold mb-4 text-center">
        Welcome to the Real-Time Chat App
      </p>

      {/* Sub-header */}
      <p className="text-sm md:text-lg text-gray-400 mb-12 text-center max-w-md">
        Create your own room and start chatting instantly with friends or colleagues.
      </p>

      {/* Create Room Button */}
      <button
        className="w-full max-w-xs px-4 py-3 mb-6 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95 text-sm md:text-base"
        onClick={async () => {
          console.log("create room");
          const randomId = Math.random().toString(36).substring(2, 8);
          setRoomId(randomId);
        }}
      >
        Create or Join a Room
      </button>

      {/* Room Form */}
      {roomId && (
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          
          {/* Name Input */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter your name"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm md:text-base"
          />

          {/* Room ID Input */}
          <input
            value={currentId}
            onChange={(e) => setCurrentId(e.target.value)}
            type="text"
            placeholder="Enter Room ID"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm md:text-base"
          />

          {/* Join Button */}
          <button
            className="w-full px-3 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 text-sm md:text-base"
            onClick={joinRoom}
          >
            Join
          </button>

          {/* Error Message */}
          {erroMessage && (
            <p className="text-red-500 text-xs md:text-sm text-center">{erroMessage}</p>
          )}

          {/* Share Room ID Text */}
          <p className="mt-4 text-gray-400 text-xs md:text-sm text-center">
            Share this room ID with your friends:
          </p>

          {/* Room ID Box */}
          <div className="w-full bg-gray-100 text-black text-base md:text-lg font-bold px-4 py-3 rounded-lg text-center break-words">
            {roomId}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
