declare const __context__: unique symbol

/** Event fired by a context requester to signal it desires a named context. */
class ContextRequestEvent<T = unknown> extends Event {
	public constructor(
		/** Context key associated with the Event. */
		public readonly context: T,

		/** Callback whose provider with a matching context should invoke. */
		public readonly callback: ContextCallback<T>,

		/** Indicates whether the context should be provided more than once. */
		public readonly subscribe?: boolean,
	) {
		super("context-request", { bubbles: true, composed: true })
	}
}

/** Returns the given context key as branded context. */
const createContext = <K, V>(key: K) => key as Context<K, V>

/** Branded context. */
type Context<K = unknown, V = unknown> = K & { [__context__]: V }

/** Data by branded context. */
type ContextData<T> = T extends Context<infer _K, infer _V> ? _V : unknown

/** Key by branded context. */
type ContextKey<T> = T extends Context<infer _K, infer _V> ? _K : unknown

/** Callback function by branded contenxt. */
type ContextCallback<T> = (value: ContextData<T>, unsubscribe?: () => void) => void

declare global {
	interface WindowEventMap {
		/** Event emitted by any target which desires a context value to be injected by an external provider. */
		"context-request": ContextRequestEvent
	}

	interface ElementEventMap {
		/** Event emitted by any target which desires a context value to be injected by an external provider. */
		"context-request": ContextRequestEvent
	}

	interface HTMLElementEventMap {
		/** Event emitted by any target which desires a context value to be injected by an external provider. */
		"context-request": ContextRequestEvent
	}
}

export { ContextRequestEvent, createContext, type Context, type ContextKey, type ContextData, type ContextCallback }
