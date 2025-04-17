import { type Context, type ContextCallback, type ContextData, type ContextKey, ContextRequestEvent, createContext } from "./context.ts";
/**
 * Observes the given context key, invoking the given callback when data is provided.
 *
 * This is used by consumers to subscribe to context data associated with the given key.
 * If a matching provider is listening, it will respond with the data and trigger the callback.
 */
declare const observeContext: <T>(
/** The context key to request data for. */
context: T, 
/** The callback function to invoke when the data is provided. */
callback: ContextCallback<T>, 
/** The `EventTarget` on which to listen. Defaults to a shared context target. */
target?: EventTarget) => void;
/**
 * Provides data for the given context key and invokes any subscribers.
 *
 * This sets up a listener on the target to respond to context requests and invokes any existing subscriptions with the current data.
 */
declare const provideContext: <T>(
/** The context key for which data is being provided. */
context: T, 
/** The data being associated with the context key. */
data: ContextData<T>, 
/** The `EventTarget` on which to listen for context requests. Defaults to a shared context target. */
target?: EventTarget) => void;
export { type Context, type ContextCallback, type ContextData, type ContextKey, ContextRequestEvent, createContext, observeContext, provideContext };
