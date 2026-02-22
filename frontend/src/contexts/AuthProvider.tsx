import { AuthContext } from "./AuthContext";
import { getCacheWithExpiry } from "../utilities";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const user = getCacheWithExpiry("cloudProfile_user");

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
