"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSupabaseSession } from "./SupabaseProvider";
import { fetchUser } from "@/lib/authentication";
import Profile from "@/components/Profile";

type UserContextType = {
  id: string;
  name: string;
  email: string;
  subscription: boolean;
  isProfileOpen: boolean;
  toggleProfile: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    subscription: false,
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const session = useSupabaseSession();

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const fetchUserProfile = async () => {
    if (!session) return;

    try {
      const { data } = await fetchUser(session);

      if (!data) return;

      setUserProfile({
        id: data.id,
        name: data.user_metadata.display_name,
        email: data.email,
        subscription: false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <UserContext.Provider value={{ userProfile, isProfileOpen, toggleProfile }}>
      {children}
      <Profile />
    </UserContext.Provider>
  );
}

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUserContext must be used within a UserContext Provider"
    );
  }
  return context;
};
