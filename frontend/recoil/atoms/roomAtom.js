import { atom } from "recoil";

export const roomIdState = atom({
  key: "roomIdState",
  default: "",
});

export const joinedState = atom({
  key: "joinedState",
  default: false,
});
