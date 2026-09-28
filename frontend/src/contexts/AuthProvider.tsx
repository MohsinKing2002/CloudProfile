import { AuthContext } from "./AuthContext";
import { getCacheWithExpiry, setCacheWithExpiry } from "../utilities";
import { useEffect, useState, type ReactNode } from "react";
import { processApiRequest } from "../apis";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState(() =>
    getCacheWithExpiry("cloudProfile_user"),
  );

  // refresh user avatar view url
  const refreshAvatarURL = async () => {
    try {
      const res = await processApiRequest("GET", "/auth/avatar/view-url");
      if (!res?.status) return;

      const updatedAvatar = res?.data?.avatar;

      setUser((prevUser: any) => {
        if (!prevUser) return prevUser;

        const updatedUser = {
          ...prevUser,
          avatar: updatedAvatar,
        };

        setCacheWithExpiry("cloudProfile_user", updatedUser);
        return updatedUser;
      });
    } catch (error) {
      console.log("ERROR: Refresh avatar URL", error);
    }
  };

  /*
   *** Handles responsibilites ***
   * 1. no avatar URL
   * 2. no expiry
   * 3. URL is already expired
   */
  useEffect(() => {
    if (!user?.avatar) return;

    const { url, expiry } = user?.avatar;

    if (!url || !expiry) {
      refreshAvatarURL();
      return;
    }

    if (Date.now() >= expiry) refreshAvatarURL();
  }, []);

  /*
   *** Handles responsibilites ***
   * 1. handles the normal case where the URL is still valid, but approaching expiry.
   */
  useEffect(() => {
    if (!user?.avatar?.expiry) return;

    const REFRESH_BEFORE_EXPIRY = 5 * 60 * 1000;
    const refreshAt = user?.avatar?.expiry - REFRESH_BEFORE_EXPIRY;

    const delay = Math.max(refreshAt - Date.now(), 0);

    const timer = setTimeout(() => {
      refreshAvatarURL();
    }, delay);

    return () => clearInterval(timer);
  }, [user?.avatar?.expiry]);

  return (
    <AuthContext.Provider value={{ user, refreshAvatarURL }}>
      {children}
    </AuthContext.Provider>
  );
};
