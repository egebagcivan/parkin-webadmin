import { configureStore } from "@reduxjs/toolkit";
import alertsReducer from "./alertsSlice";

const store = configureStore({
  reducer: {
    alerts: alertsReducer,
  },
});

export default store;
