import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const storedState = localStorage.getItem("authState");
    return storedState
      ? JSON.parse(storedState)
      : {
          isSupervisor: false,
          username: null,
          user_id: null,
          token: null,
        };
  });

  useEffect(() => {
    if (authState && authState.token) {
      localStorage.setItem("authState", JSON.stringify(authState));
    } else {
      localStorage.removeItem("authState");
    }
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
