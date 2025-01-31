import React, { createContext, useState, useContext } from "react";

const CollectorsDataContext = createContext();
export const useCollectorsData = () => useContext(CollectorsDataContext);

export const CollectorsDataProvider = ({ children }) => {
  const [collectors, setCollectors] = useState([]);

  const getCollectors = async () => {
    const response = await fetch("http://localhost:3001/collectors", {
      method: "GET",
    });

    const collectorsData = await response.json();
    const collectors = collectorsData.map((collector) => {
      return {
        value: collector.id,
        label: collector.collector,
      };
    });

    setCollectors(collectors);
  };

  return (
    <CollectorsDataContext.Provider value={{ collectors, getCollectors }}>
      {children}
    </CollectorsDataContext.Provider>
  );
};
