import { useEffect, useState } from "react";
import { ClientUser, decodeJwt } from "~/services/auth";
import { get_cookie } from "~/services/cookie";

export type Session = ClientUser | null;

export default function useSession() {
  const [session, setSession] = useState<Session>(null);
  useEffect(() => {
    const getAndSet = () => {
      const session = get_cookie("token");
      if (session) {
        setSession(decodeJwt(session));
      }
    };
    getAndSet();
  }, []);

  return session;
}
