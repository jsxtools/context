declare const __context__: unique symbol

/** Event fired by a context requester to signal it desires a named context. */
class ContextRequestEvent<T = unknown> extends Event {
	public constructor(
		/** Context key associated with the Event. */
		public readonly context: ExtractContext<T>,

		/** Callback whose provider with a matching context should invoke. */
		public readonly callback: ContextCallback<ContextType<T>>,

		/** Indicates whether the context should be provided more than once. */
		public readonly subscribe?: boolean,
	) {
		super("context-request", { bubbles: true, composed: true })
	}
}

/** Returns a context of the given key and value type. */
const createContext = <ValueType>(key: unknown) => key as Context<typeof key, ValueType>

/** Branded context. */
type Context<KeyType = unknown, ValueType = unknown> = KeyType & { [__context__]: ValueType }

/** Data by branded context. */
type ContextType<T> = T extends Context<infer _KeyType, infer ValueType> ? ValueType : unknown

/** Callback function by branded contenxt. */
type ContextCallback<ValueType> = (value: ValueType, unsubscribe?: () => void) => void

/** Extracts a branded context or unknown. */
type ExtractContext<T> = T extends Context ? T : unknown

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

interface EventTargetConstructor<T = EventTarget> {
	new (...args: any[]): EventTarget & T

	prototype: EventTarget & T
}

export { type Context, type ContextCallback, type ContextType, type EventTargetConstructor, type ExtractContext, ContextRequestEvent, createContext }
