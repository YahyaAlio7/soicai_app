import { createContext, useContext } from "react";

export type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
  cover: string;
};

type AuthContextType = {
  isLogin: string | null;
  setLogin: React.Dispatch<React.SetStateAction<string | null>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const authContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(authContext);
}
