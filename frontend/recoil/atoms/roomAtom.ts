import { atom } from "recoil";



export const roomIdState = atom<string>({
  key: "roomIdState",
  default: "",
});

export const joinedState = atom<boolean>({
  key: "joinedState",
  default: false,
});
