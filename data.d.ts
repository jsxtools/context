import { type Context, type ContextCallback, type ContextData, type ContextKey, ContextRequestEvent, createContext } from "./context.ts";
/** Returns the context data for the given context key on the given target. */
declare const getContextData: <T>(
/** Target context key */
context: T, 
/** Target `EventTarget`. */
target?: EventTarget) => ContextData<T> | undefined;
/** Assigns to the given context key the given value on the given target. */
declare const setContextData: <T>(
/** Target context key */
context: T, 
/** Value to assign to the context key. */
value: ContextData<T>, 
/** Target `EventTarget`. */
target?: EventTarget) => void;
export { type Context, type ContextCallback, type ContextData, type ContextKey, ContextRequestEvent, createContext, getContextData, setContextData };
