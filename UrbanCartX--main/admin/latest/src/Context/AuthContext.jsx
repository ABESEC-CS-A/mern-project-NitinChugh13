import React, { createContext } from "react";

export const authDataContext = createContext();

function authContext({ children }) {
  let serverUrl = "https://urbancartx-backend.onrender.com";

  let value = { serverUrl };

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
}

export default authContext;
