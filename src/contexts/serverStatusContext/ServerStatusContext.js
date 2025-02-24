import { createContext, useContext, useEffect, useState } from "react";

const ServerStatusContext = createContext();

export const ServerStatusProvider = ({ children }) => {
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch("http://localhost:3001", {
          method: "GET",
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
    const interval = setInterval(checkServerStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ServerStatusContext.Provider value={{ serverOnline }}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => useContext(ServerStatusContext);
