// Routing
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./Routing";

// Providers
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

// Redux
import { Provider } from "react-redux";
import store from "./app/store";

// Config
import { useLocalStorage } from "@mantine/hooks";

// Components
import { AuthInitialiser } from "@components/AuthInitialiser";
import { ErrorProvider } from "@components/ErrorProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const App = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "colorScheme",
    defaultValue: "light",
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{
              colorScheme,
              primaryColor: "violet",
              fontFamily: "sans-serif",
            }}
          >
            <NotificationsProvider position="top-right">
              <ModalsProvider>
                <ErrorProvider>
                  <AuthInitialiser>
                    <BrowserRouter>
                      <AppRoutes />
                    </BrowserRouter>
                  </AuthInitialiser>
                </ErrorProvider>
              </ModalsProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
};
