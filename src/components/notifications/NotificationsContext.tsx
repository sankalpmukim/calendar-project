import { createContext, Dispatch, SetStateAction, useState } from "react";

export interface NotificationsContextType {
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  show: boolean;
}

export const NotificationsContext = createContext<
  | [
      NotificationsContextType,
      Dispatch<SetStateAction<NotificationsContextType>>
    ]
  | null
>(null);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<NotificationsContextType>({
    title: "",
    message: "",
    type: "success",
    show: false,
  });

  return (
    <NotificationsContext.Provider value={[state, setState]}>
      {children}
    </NotificationsContext.Provider>
  );
}
