import { createContext } from "react";

type AuthContextType = {
  user: any;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
});
