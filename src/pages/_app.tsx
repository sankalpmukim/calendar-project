import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { NotificationsProvider } from "~/components/notifications/NotificationsContext";
import NotificationsComponent from "~/components/notifications/NotificationsComponent";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <NotificationsProvider>
      <NotificationsComponent />
      <Component {...pageProps} />
    </NotificationsProvider>
  );
};

export default api.withTRPC(MyApp);
