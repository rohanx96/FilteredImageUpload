//@flow
import persistedReducer from "./reducers";
import { applyMiddleware, compose, createStore } from "redux";
import { persistStore } from "redux-persist";
import { createLogger } from "redux-logger";
// import { composeWithDevTools } from 'redux-devtools-extension';

// middleware that logs actions
const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});

const enhancer = applyMiddleware(loggerMiddleware);

export const store = createStore(persistedReducer, {}, enhancer);

export const persistor = persistStore(store);
