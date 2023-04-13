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
  const [_, setNotifications] = notificationsCtx;
  const notify = useCallback(
    ({ message, title, type }: NotificationsContextType) => {
      setNotifications({ message, title, type, show: true });
    },
    [setNotifications]
  );
  return notify;
};

export default useNotify;
