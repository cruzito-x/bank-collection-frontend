import React, { createContext, useState, useContext } from "react";
import { useAuth } from "../authContext/AuthContext";

const CollectorsDataContext = createContext();
export const useCollectorsData = () => useContext(CollectorsDataContext);

export const CollectorsDataProvider = ({ children }) => {
  const { authState } = useAuth();
  const [collectors, setCollectors] = useState([]);
  const token = authState.token;

  const getCollectors = async () => {
    const response = await fetch("http://localhost:3001/collectors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const collectorsData = await response.json();
    const uniqueCollector = new Map();

    collectorsData.forEach((collector) => {
      if (!uniqueCollector.has(collector.id)) {
        uniqueCollector.set(collector.id, {
          label: collector.collector,
          value: collector.id,
        });
      }
    });

    const collectors = Array.from(uniqueCollector.values());

    setCollectors(collectors);
  };

  return (
    <CollectorsDataContext.Provider value={{ collectors, getCollectors }}>
      {children}
    </CollectorsDataContext.Provider>
  );
};
