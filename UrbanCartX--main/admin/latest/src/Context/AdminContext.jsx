// AdminContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";

export const adminDataContext = createContext();

function AdminContext({ children }) {
  const [adminData, setAdminData] = useState(null);
  const { serverUrl } = useContext(authDataContext);

  const getAdmin = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/getadmin", {
        withCredentials: true,
      });
      setAdminData(result.data);
      console.log("Admin data:", result.data);
    } catch (error) {
      // 401 = not logged in → ye normal hai login page pe
      if (error.response?.status === 401) {
        setAdminData(null);
        return;
      }
      setAdminData(null);
      console.error("getAdmin error:", error);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  const value = {
    adminData,
    getAdmin,
    setAdminData,
  };

  return (
    <adminDataContext.Provider value={value}>
      {children}
    </adminDataContext.Provider>
  );
}

export default AdminContext;
