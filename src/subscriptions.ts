import type { Context, ContextCallback, ContextType, EventTargetConstructor, ExtractContext } from "./context.ts"

import { ContextRequestEvent, createContext } from "./context.ts"

/** Registers a callback to be invoked whenever data is delivered to the specified consumer and context. */
const addContextListener = <T>(
	/** The consumer to match. */
	consumer: EventTarget,

	/** The context key to match. */
	context: ExtractContext<T>,

	/** The callback to invoke. */
	callback: ContextCallback<ContextType<T>>,

	/** Whether the callback should subscribe. */
	subscribe?: boolean,
): void => {
	consumer.dispatchEvent(new ContextRequestEvent<T>(context, callback, subscribe))
}

/** Removes a callback from being invoked whenever data is delivered to the matching consumer and context. */
const removeContextListener = <T>(
	/** The consumer to match. */
	consumer: EventTarget,

	/** The context key to match. */
	context: ExtractContext<T>,

	/** The callback to release. */
	callback: ContextCallback<ContextType<T>>,
): void => {
	UPSERT_INVOKERS_BY_CONSUMER_AND_CONTEXT<ContextType<T>>(consumer, context).delete(callback)
}

/** Delivers data to the specified consumer and context. */
const setContextValue = <T>(
	/** The provider to match. */
	provider: EventTarget,

	/** The context key to match. */
	context: ExtractContext<T>,

	/** The data to provide. */
	value: ContextType<T>,
): void => {
	const consumers = UPSERT(CONSUMERS_BY_PROVIDER, provider, () => {
		provider.addEventListener(
			"context-request",
			// @ts-expect-error while `EventTarget` listeners cannot be typed
			(event: ContextRequestEvent<T>) => {
				if (event.context !== context) return

				event.stopImmediatePropagation()

				const callbacks = UPSERT_INVOKERS_BY_CONSUMER_AND_CONTEXT<ContextType<T>>(event.target!, context)

				if (event.subscribe) {
					consumers.add(event.target!)

					if (callbacks.size < callbacks.add(event.callback).size) {
						INVOKE_CALLBACK(event.callback, value, callbacks)
					}
				} else {
					INVOKE_CALLBACK(event.callback, value, callbacks)
				}
			},
		)

		return new Set()
	})

	for (const consumer of consumers) {
		const callbacks = UPSERT_INVOKERS_BY_CONSUMER_AND_CONTEXT<ContextType<T>>(consumer, context)

		for (const callback of callbacks) {
			INVOKE_CALLBACK(callback, value, callbacks)
		}
	}
}

/** Retrieves data from the specified consumer and context. */
const getContextValue = <T>(consumer: EventTarget, context: ExtractContext<T>): ContextType<T> | undefined => {
	let returnValue: unknown

	addContextListener<T>(consumer, context, (value) => {
		returnValue = value
	})

	return returnValue as ContextType<T> | undefined
}

export {
	type Context,
	type ContextCallback,
	type ContextType,
	type EventTargetConstructor,
	type ExtractContext,
	ContextRequestEvent,
	addContextListener,
	createContext,
	getContextValue,
	removeContextListener,
	setContextValue,
}

// #region Internals

/** Map of providers to a set of consumers. */
const CONSUMERS_BY_PROVIDER = new Map<EventTarget, Set<EventTarget>>()

/** Map of consumers to a map of context keys to callbacks. */
const INVOKERS_BY_CONTEXT_BY_CONSUMER = new WeakMap<EventTarget, Map<any, Set<ContextCallback<any>>>>()

/** Invokes the given callback with the given data. */
const INVOKE_CALLBACK = <ValueType>(callback: ContextCallback<ValueType>, value: ValueType, callbacks: Set<ContextCallback<ValueType>>): void => {
	try {
		callback(value, () => {
			callbacks.delete(callback)
		})
	} catch {
		// fail silently
	}
}

const UPSERT_INVOKERS_BY_CONSUMER_AND_CONTEXT = <ValueType>(consumer: EventTarget, context: Context<any, ValueType>): Set<ContextCallback<ValueType>> =>
	UPSERT(
		UPSERT(INVOKERS_BY_CONTEXT_BY_CONSUMER, consumer, () => new Map()),
		context,
		() => new Set(),
	)

/** Returns the value for the given map key, initializing it with the return value of the initializer if it does not exist. */
const UPSERT = <K, V>(map: Map<K, V> | WeakMap<NonNullable<K>, V>, key: K, initializer: () => V, value?: V): V =>
	map.get(key as NonNullable<K>) ?? (map.set(key as NonNullable<K>, (value = initializer())), value)

// #endregion
