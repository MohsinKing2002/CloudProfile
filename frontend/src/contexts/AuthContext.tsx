import { createContext } from "react";

type AuthContextType = {
  user: any;
  refreshAvatarURL: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  refreshAvatarURL: async () => {},
});
