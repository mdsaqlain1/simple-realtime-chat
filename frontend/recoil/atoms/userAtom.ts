import {atom} from "recoil";

interface User {
  id: string | null;
  name: string | null;
}

export const userState = atom<User>({
  key: "userState",
  default: {
    id: null,
    name: null,
  },
});
