import { type Context, type ContextCallback, type ContextData, type ContextKey, ContextRequestEvent, createContext } from "./context.ts"

/** Returns the context data for the given context key on the given target. */
const getContextData = <T>(
	/** Target context key */
	context: T,

	/** Target `EventTarget`. */
	target = DEFAULT_CONTEXT,
) => {
	let returnValue: unknown

	target.dispatchEvent(
		new ContextRequestEvent(context, (value) => {
			returnValue = value
		}),
	)

	return returnValue as ContextData<T> | undefined
}

/** Assigns to the given context key the given value on the given target. */
const setContextData = <T>(
	/** Target context key */
	context: T,

	/** Value to assign to the context key. */
	value: ContextData<T>,

	/** Target `EventTarget`. */
	target = DEFAULT_CONTEXT,
) =>
	// @ts-expect-error while `EventTarget` listeners cannot be typed
	target.addEventListener("context-request", (event: ContextRequestEvent<T>) => {
		event.stopImmediatePropagation()

		if (event.context === context) {
			event.callback(value)
		}
	})

export { type Context, type ContextCallback, type ContextData, type ContextKey, ContextRequestEvent, createContext, getContextData, setContextData }

// #region Internals

const DEFAULT_CONTEXT = new EventTarget()

// #endregion
