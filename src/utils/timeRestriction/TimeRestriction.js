import { useEffect } from "react";
import moment from "moment";

const useTimeRestriction = () => {

  useEffect(() => {
    const checkBusinessHours = () => {
      const now = moment();
      const hour = now.hour();
      const minutes = now.minute();

      const isInBusinessHours =
        hour > 8 && (hour < 18 || (hour === 18 && minutes < 30));

      if (!isInBusinessHours) {
        localStorage.removeItem("authState");
        window.location.href = "/";
      }
    };

    checkBusinessHours();

    const interval = setInterval(checkBusinessHours, 10000);

    return () => clearInterval(interval);
  }, []);
};

export default useTimeRestriction;
