import { ContextRequestEvent, addContextListener, createContext, getContextValue, removeContextListener, setContextValue } from "./subscriptions.js"

Object.assign(globalThis, { ContextRequestEvent, addContextListener, createContext, getContextValue, removeContextListener, setContextValue })
