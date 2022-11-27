import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import store from "./redux/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <NotificationsProvider position="top-right">
      <Provider store={store}>
        <App />
      </Provider>
    </NotificationsProvider>
  </MantineProvider>
);

reportWebVitals();
