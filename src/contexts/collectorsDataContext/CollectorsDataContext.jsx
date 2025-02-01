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
