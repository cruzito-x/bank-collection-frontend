import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "../authContext/AuthContext";
import { useNavigate } from "react-router-dom";

const CollectorsDataContext = createContext();
export const useCollectorsData = () => useContext(CollectorsDataContext);

export const CollectorsDataProvider = ({ children }) => {
  const { authState } = useAuth();
  const [collectors, setCollectors] = useState([]);
  const navigate = useNavigate();
  const token = authState.token;

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });

  const getCollectors = async () => {
    const response = await fetch("http://localhost:3001/collectors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const collectorsData = await response.json();

    if (response.status === 200) {
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
    } else if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("authState");
      navigate("/");
      return;
    } else {
    }
  };

  return (
    <CollectorsDataContext.Provider value={{ collectors, getCollectors }}>
      {children}
    </CollectorsDataContext.Provider>
  );
};
