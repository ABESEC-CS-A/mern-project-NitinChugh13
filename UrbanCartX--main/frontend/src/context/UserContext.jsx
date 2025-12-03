// src/context/userContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthDataContext } from "./AuthContext.jsx";

export const UserDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const { serverUrl } = useContext(AuthDataContext);

  const getCurrentUser = async () => {
    if (!serverUrl) return;

    try {
      const res = await axios.get(`${serverUrl}/api/auth/getcurrentuser`, {
        withCredentials: true,
      });

      const data = res.data?.user ?? res.data ?? null;
      setUserData(data);
      console.log("Current user:", data);
    } catch (err) {
      if (err?.response?.status === 401) {
        // not logged in
        setUserData(null);
        return;
      }

      console.error("getCurrentUser error:", err);
      setUserData(null);
    }
  };

  useEffect(() => {
    if (serverUrl) {
      getCurrentUser();   // call once whenever serverUrl becomes available/changes
    }
  }, [serverUrl]);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
