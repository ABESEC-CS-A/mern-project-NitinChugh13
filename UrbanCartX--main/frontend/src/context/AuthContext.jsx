import React, { createContext } from "react";

export const AuthDataContext = createContext();

function AuthContext({ children }) {   // ✅ Accept children properly
  let serverUrl = "https://urbancartx-backend.onrender.com";

  let value = {
    serverUrl,
  };

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  );
}

export default AuthContext;

