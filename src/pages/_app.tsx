import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { NotificationsProvider } from "~/components/notifications/NotificationsContext";
import NotificationsComponent from "~/components/notifications/NotificationsComponent";
import { CalendarProvider } from "~/components/calendar/useCalendars";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <NotificationsProvider>
      <CalendarProvider>
        <NotificationsComponent />
        <Component {...pageProps} />
      </CalendarProvider>
    </NotificationsProvider>
  );
};

export default api.withTRPC(MyApp);
