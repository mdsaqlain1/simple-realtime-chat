// recoil/atoms/socketAtom.js
import { atom } from "recoil";

export const socketState = atom<WebSocket | null>({
  key: "socketState",
  default: null,
});
