import { type Context, type ContextCallback, type ContextData, type ContextKey, ContextRequestEvent, createContext } from "./context.ts"

/**
 * Observes the given context key, invoking the given callback when data is provided.
 *
 * This is used by consumers to subscribe to context data associated with the given key.
 * If a matching provider is listening, it will respond with the data and trigger the callback.
 */
const observeContext = <T>(
	/** The context key to request data for. */
	context: T,

	/** The callback function to invoke when the data is provided. */
	callback: ContextCallback<T>,

	/** The `EventTarget` on which to listen. Defaults to a shared context target. */
	target = DEFAULT_CONTEXT,
): void => {
	target.dispatchEvent(new ContextRequestEvent(context, callback, true))
}

/**
 * Provides data for the given context key and invokes any subscribers.
 *
 * This sets up a listener on the target to respond to context requests and invokes any existing subscriptions with the current data.
 */
const provideContext = <T>(
	/** The context key for which data is being provided. */
	context: T,

	/** The data being associated with the context key. */
	data: ContextData<T>,

	/** The `EventTarget` on which to listen for context requests. Defaults to a shared context target. */
	target: EventTarget = DEFAULT_CONTEXT,
): void => INVOKE_CALLBACKS(UPSERT_PROVIDER<T>(context, target, data), data, target)

export { type Context, type ContextCallback, type ContextData, type ContextKey, ContextRequestEvent, createContext, observeContext, provideContext }

// #region Internals

const DEFAULT_CONTEXT = new EventTarget()
const SUBSCRIBERS = new Map<unknown, ProviderMap>()

type ConsumerMap<T = unknown> = Map<EventTarget, Set<ContextCallback<T>>>
type ProviderMap<T = unknown> = WeakMap<EventTarget, ConsumerMap<T>>

/** Returns subscribers for the given context, initializing them they do not exist. */
const UPSERT_CONTEXT = <T>(context: T): ProviderMap<T> => UPSERT(SUBSCRIBERS, context, () => new WeakMap())

/** Returns subscribers for the given context/provider, initializing them with the given data if they do not exist. */
const UPSERT_PROVIDER = <T>(context: T, provider: EventTarget, data: ContextData<T>): ConsumerMap<T> => {
	const subscribersByProvider = UPSERT(UPSERT_CONTEXT<T>(context), provider, () => {
		provider.addEventListener(
			"context-request",
			// @ts-expect-error while `EventTarget` listeners cannot be typed
			(event: ContextRequestEvent<T>) => {
				if (event.context !== context) return

				event.stopImmediatePropagation()

				if (event.subscribe) {
					const subscribersByConsumer = UPSERT_CONSUMER<T>(event.context, event.currentTarget!, event.target!, data)

					if (subscribersByConsumer.size < subscribersByConsumer.add(event.callback).size) {
						INVOKE_CALLBACK(event.callback, subscribersByConsumer, data, event.currentTarget!, event.target!)
					}
				}
			},
		)

		return new Map()
	})

	return subscribersByProvider
}

/** Returns subscribers for the given context/provider/consumer, initializing them with the given data if they do not exist. */
const UPSERT_CONSUMER = <T>(context: T, provider: EventTarget, consumer: EventTarget, data: ContextData<T>): Set<ContextCallback<T>> =>
	UPSERT(UPSERT_PROVIDER<T>(context, provider, data), consumer, () => new Set())

/** Invokes all the given subscriber callbacks with the given data. */
const INVOKE_CALLBACKS = <T>(subscribers: ConsumerMap<T>, data: ContextData<T>, provider: EventTarget): void => {
	for (const [consumer, callbacks] of subscribers) {
		for (const callback of callbacks) {
			INVOKE_CALLBACK(callback, callbacks, data, provider, consumer)
		}
	}
}

/** Invokes the given callback with the given data. */
const INVOKE_CALLBACK = <T>(callback: ContextCallback<T>, callbacks: Set<ContextCallback<T>>, data: ContextData<T>, provider: EventTarget, consumer: EventTarget): void => {
	try {
		const unsubscribe = () => {
			callbacks.delete(callback)
		}

		if ((provider as ParentNode).contains?.(consumer as Node) ?? true) {
			callback(data, unsubscribe)
		} else {
			unsubscribe()
		}
	} catch {
		// fail silently
	}
}

/** Returns the value for the given map key, initializing it with the return value of the initializer if it does not exist. */
const UPSERT = <K, V>(map: Map<K, V> | WeakMap<NonNullable<K>, V>, key: K, initializer: () => V, value?: V): V =>
	map.get(key as NonNullable<K>) ?? (map.set(key as NonNullable<K>, (value = initializer())), value)

// #endregion
