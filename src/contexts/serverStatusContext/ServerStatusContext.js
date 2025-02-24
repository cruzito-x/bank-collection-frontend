import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authContext/AuthContext";

const ServerStatusContext = createContext();

export const ServerStatusProvider = ({ children }) => {
  const { authState } = useAuth();
  const token = authState.token;
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch("http://localhost:3001", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setServerOnline(true);
        } else {
          setServerOnline(false);
        }
      } catch (error) {
        setServerOnline(false);
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ServerStatusContext.Provider value={{ serverOnline }}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => useContext(ServerStatusContext);
