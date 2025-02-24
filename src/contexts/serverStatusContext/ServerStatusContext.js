import { createContext, useContext, useEffect, useState } from "react";

const ServerStatusContext = createContext();

export const ServerStatusProvider = ({ children }) => {
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch("http://localhost:3001");
        setServerOnline(response.ok);
      } catch (error) {
        setServerOnline(false);
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ServerStatusContext.Provider value={{ serverOnline }}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => useContext(ServerStatusContext);
