import { useCallback, useContext } from "react";
import {
  NotificationsContext,
  NotificationsContextType,
} from "./NotificationsContext";

const useNotify = () => {
  const notificationsCtx = useContext(NotificationsContext);
  if (!notificationsCtx) {
    throw new Error("useNotify must be used within a NotificationsProvider");
  }
  const setNotifications = notificationsCtx[1];
  const notify = useCallback(
    ({ message, title, type }: NotificationsContextType) => {
      setNotifications({ message, title, type, show: true });

      setTimeout(() => {
        setNotifications((prev) => ({ ...prev, show: false }));
      }, 3000);
    },
    [setNotifications]
  );
  return notify;
};

export default useNotify;
