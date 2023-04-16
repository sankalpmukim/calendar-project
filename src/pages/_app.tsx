import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { NotificationsProvider } from "~/components/notifications/NotificationsContext";
import NotificationsComponent from "~/components/notifications/NotificationsComponent";
import { CalendarProvider } from "~/components/calendar/useCalendars";
import AddEvent, {
  AddEventModalProvider,
} from "~/components/calendar/AddEvent";
import AddCalendar, {
  AddCalendarModalProvider,
} from "~/components/calendar/AddCalendar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <NotificationsProvider>
      <CalendarProvider>
        <AddEventModalProvider>
          <AddCalendarModalProvider>
            <AddCalendar />
            <AddEvent />
            <NotificationsComponent />
            <Component {...pageProps} />
          </AddCalendarModalProvider>
        </AddEventModalProvider>
      </CalendarProvider>
    </NotificationsProvider>
  );
};

export default api.withTRPC(MyApp);
