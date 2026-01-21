import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import teamReducer from "./teamSlice";
import patientReducer from "./patientSlice";

/* ---------------- ROOT REDUCER ---------------- */
const rootReducer = combineReducers({
  team: teamReducer,
  patient: patientReducer,
});

/* ---------------- PERSIST CONFIG ---------------- */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["team"], // persist only these
};

/* ---------------- PERSISTED REDUCER ---------------- */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ---------------- STORE ---------------- */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // REQUIRED for redux-persist
    }),
});

/* ---------------- PERSISTOR ---------------- */
export const persistor = persistStore(store);
