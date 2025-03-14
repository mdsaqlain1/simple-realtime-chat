import { atom } from "recoil";

interface Message {
  id: string;
  name: string;
  message: string;
}

export const messageState = atom<Message[]>({
  key: "messageState",
  default: [],
});
