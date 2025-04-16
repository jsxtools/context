import type { Context, ContextCallback, ContextType, EventTargetConstructor, ExtractContext } from "./subscriptions.ts"

import { ContextRequestEvent, addContextListener, createContext, getContextValue, removeContextListener, setContextValue } from "./subscriptions.ts"

/** Mixin that allows the target to add a callback for a context. */
const ContextConsumerMixin = <T extends EventTargetConstructor>(Target: T): T & ContextConsumerMixin.Constructor =>
	class extends Target {
		addContextListener<T>(context: ExtractContext<T>, callback: ContextCallback<ContextType<T>>, subscribe = null as unknown as boolean): void {
			addContextListener(this, context, callback, subscribe)
		}

		removeContextListener<T>(context: ExtractContext<T>, callback: ContextCallback<ContextType<T>>): void {
			removeContextListener(this, context, callback)
		}
	}

namespace ContextConsumerMixin {
	export interface Constructor extends EventTargetConstructor<Mixin> {}

	export interface Mixin {
		addContextListener<T>(context: ExtractContext<T>, callback: ContextCallback<ContextType<T>>, subscribe?: boolean): void

		removeContextListener<T>(context: ExtractContext<T>, callback: ContextCallback<ContextType<T>>): void
	}
}

/** Mixin that allows the target to provide values to a context. */
const ContextProviderMixin = <T extends EventTargetConstructor>(Target: T): T & ContextProviderMixin.Constructor =>
	class extends Target {
		setContextValue<T>(context: ExtractContext<T>, value: ContextType<T>): void {
			setContextValue(this, context, value)
		}
	}

namespace ContextProviderMixin {
	export interface Constructor extends EventTargetConstructor<Mixin> {}

	export interface Mixin {
		setContextValue<T>(context: ExtractContext<T>, value: ContextType<T>): void
	}
}

export {
	type Context,
	type ContextCallback,
	type ContextType,
	type EventTargetConstructor,
	type ExtractContext,
	ContextConsumerMixin,
	ContextProviderMixin,
	ContextRequestEvent,
	addContextListener,
	createContext,
	getContextValue,
	removeContextListener,
	setContextValue,
}
