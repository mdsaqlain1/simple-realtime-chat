import React, { useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import { messageState } from "../../recoil/atoms/messageAtom.ts";
import { socketState } from "../../recoil/atoms/socketAtom.ts";
import { roomIdState } from "../../recoil/atoms/roomAtom.ts";
import { userState } from "../../recoil/atoms/userAtom.ts";

const Chat = () => {
  const [message] = useRecoilState(messageState);
  const inputRef = useRef<HTMLInputElement | null>(null); // Typed as HTMLInputElement | null
  const [socket] = useRecoilState(socketState);
  const [roomId] = useRecoilState(roomIdState);
  const [user] = useRecoilState(userState);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null); // Typed as HTMLDivElement | null

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight; // No error now
  }, [message]);

  const handleSend = () => {
    const newMsg = inputRef.current?.value.trim(); // Use optional chaining
    if (!newMsg || !socket) return; // Ensure socket is not null

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: newMsg,
          id: user.id,
          name: user.name,
        },
      })
    );

    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input field
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { // Typed event
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-gray-100 px-4">
      <div className="w-full max-w-md h-[80vh] flex flex-col bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-800">

        {/* Header */}
        <div className="bg-gray-800 py-4 px-6 text-center text-xl font-semibold border-b border-gray-700 text-gray-100">
          Chat Room
          <div className="text-sm text-gray-400 mt-1">Room ID: {roomId || "N/A"}</div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 p-4 overflow-y-auto space-y-3 scroll-smooth scrollbar-hide bg-gray-900"
        >
          {message.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet!</p>
          ) : (
            message.map((msg, index) => {
              const isCurrentUser = msg.id === user.id;
              return (
                <div
                  key={index}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                    <span className="text-xs px-1 text-gray-400 mb-1">{msg.name || "Unknown"}</span>
                    <span
                      className={`
                        inline-block px-4 py-2 rounded-xl shadow-sm text-sm
                        ${isCurrentUser
                          ? "bg-gray-300 text-black"
                          : "bg-gray-800 text-white"
                        }
                      `}
                    >
                      {msg.message}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 flex items-center bg-gray-800">
          <input
            type="text"
            ref={inputRef}
            placeholder="Type a message..."
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-900 text-gray-100 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition"
          />
          <button
            type="submit"
            onClick={handleSend}
            className="
              ml-2 md:px-4 py-2 sm:px-3 lg:px-4 px-2
              bg-gray-300 hover:bg-gray-400
              text-gray-900 font-semibold
              rounded-lg transition duration-200
            "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;