import React, { useState } from "react";
import { authContext, type User } from "./auth.context";

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [isLogin, setLogin] = useState<string | null>(() => localStorage.getItem("tkn"));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  return <authContext.Provider value={{ isLogin, setLogin, user, setUser }}>{children}</authContext.Provider>;
}
