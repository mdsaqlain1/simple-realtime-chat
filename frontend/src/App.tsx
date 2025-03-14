import { useEffect } from "react";
import { useRecoilState } from "recoil";
import Home from "./components/Home.js";
import Chat from "./components/Chat.js";
import { joinedState, roomIdState } from "../recoil/atoms/roomAtom.ts";
import { socketState } from "../recoil/atoms/socketAtom.ts";
import { messageState } from "../recoil/atoms/messageAtom.ts";


const App = () => {
  const [joined] = useRecoilState(joinedState);
  const [socket, setSocket] = useRecoilState(socketState);
  const [messages, setMessages] = useRecoilState(messageState);
  const [roomId] = useRecoilState<string>(roomIdState);
  console.log(roomId, messages, socket);
  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.onopen = () => {
      console.log("Connected to server");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
      setSocket(null);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onmessage = (msg) => {
      const msgParsed = JSON.parse(msg.data);
      setMessages((prev) => [...prev, msgParsed]);
    };

    return () => {
      console.log("Closing WebSocket...");
      ws.close();
    };
  }, []);


  return <div>{!joined ? <Home /> : <Chat />}</div>;
};

export default App;
