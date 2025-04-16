import type { Context, ContextCallback, ContextType, ExtractContext } from "../../context.ts"

import { expect, test, vi } from "vitest"

const testContextSubscriptions = (
	createContextFactory: () => <ValueType>(key: unknown) => Context<typeof key, ValueType>,
	addContextListenerFactory: () => <T>(consumer: EventTarget, context: ExtractContext<T>, callback: ContextCallback<ContextType<T>>, subscribe?: boolean) => void,
	removeContextListenerFactory: () => <T>(consumer: EventTarget, context: ExtractContext<T>, callback: ContextCallback<ContextType<T>>) => void,
	setContextValueFactory: () => <T>(consumer: EventTarget, context: ExtractContext<T>, value: ContextType<T>) => void,
	getContextValueFactory: () => <T>(consumer: EventTarget, context: ExtractContext<T>) => ContextType<T> | undefined,
) => {
	const defaultTarget = new EventTarget()

	const createContext = createContextFactory()
	const addContextListener = addContextListenerFactory()
	const removeContextListener = removeContextListenerFactory()
	const setContextValue = setContextValueFactory()
	const getContextValue = getContextValueFactory()

	test("createContext creates a branded context", () => {
		const context = createContext("test")

		expect(context).toBe("test")
	})

	test("ContextRequestEvent constructor and properties", () => {
		let receivedData: unknown
		let receivedUnsubscribe: (() => void) | undefined

		const context = createContext<typeof data>("test")
		const callback = vi.fn((data: unknown, unsubscribe?: () => void) => {
			receivedData = data
			receivedUnsubscribe = unsubscribe
		})
		const error = new Error("error")
		const throwing = vi.fn(() => {
			throw error
		})
		const data = { key: "value" }

		setContextValue(defaultTarget, context, data)

		expect(callback).toHaveBeenCalledTimes(0)
		expect(throwing).toHaveBeenCalledTimes(0)
		expect(receivedData).toBe(undefined)

		// requesting subscription for a provided subscription should invoke the callback
		addContextListener(defaultTarget, context, callback, true)

		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
		expect(receivedData).toBe(data)

		// providiving data should invoke the callback again
		setContextValue(defaultTarget, context, data)

		expect(callback).toHaveBeenCalledTimes(2)
		expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
		expect(receivedData).toBe(data)

		// requesting a subscription again should not invoke the callback
		addContextListener(defaultTarget, context, callback, true)
		addContextListener(defaultTarget, context, callback, true)
		addContextListener(defaultTarget, context, callback, true)

		expect(callback).toHaveBeenCalledTimes(2)
		expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
		expect(receivedData).toBe(data)

		// requesting another context subscription should not invoke the callback
		addContextListener(defaultTarget, "another-context", callback, true)
		addContextListener(defaultTarget, "another-context", callback, true)
		addContextListener(defaultTarget, "another-context", callback, true)

		expect(callback).toHaveBeenCalledTimes(2)
		expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
		expect(receivedData).toBe(data)

		// providing another context data should not invoke the callback
		setContextValue(defaultTarget, "yet-another-context", data)
		setContextValue(defaultTarget, "yet-another-context", data)
		setContextValue(defaultTarget, "yet-another-context", data)

		expect(callback).toHaveBeenCalledTimes(2)
		expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
		expect(receivedData).toBe(data)

		// unsubscribe the callback
		expect(receivedUnsubscribe).toBeDefined()
		expect(receivedUnsubscribe!()).toBeUndefined()

		// re-initialize the subscription
		setContextValue(defaultTarget, context, data)
		addContextListener(defaultTarget, context, callback, true)

		// re-initializing the subscription should invoke the callback again
		expect(callback).toHaveBeenCalledTimes(3)
		expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
		expect(receivedData).toBe(data)

		// requesting a subscription with a thrower should invoke the thrower
		addContextListener(defaultTarget, context, throwing, true)

		expect(throwing).toHaveBeenCalledTimes(1)
		expect(throwing).toThrowError(error)
	})

	test("context callbacks are unsubscribed when consumer is not contained in provider", () => {
		const context = "test" as Context<string, typeof data>
		const data = { key: "value" }
		const callback = vi.fn()

		// Create a provider and consumer that are not in the same DOM tree
		const provider = document.createElement("div")
		const consumer = document.createElement("div")

		// Add the consumer to the provider
		provider.appendChild(consumer)

		// Provide data to the provider/context
		setContextValue(provider, context, data)

		// Consume data from the provider/context by bubbling up from the consumer
		addContextListener(consumer, context, callback, true)

		// Now the callback should be called since the consumer is contained in the provider
		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith(data, expect.any(Function))

		// Release the callback from the consumer/context
		removeContextListener(consumer, context, callback)

		provider.removeChild(consumer)

		// Provide context on the provider
		setContextValue(provider, context, data)

		// Now the callback should be called since the consumer is contained in the provider
		expect(callback).toHaveBeenCalledTimes(1)
		expect(callback).toHaveBeenCalledWith(data, expect.any(Function))
	})

	test("getContextData and setContextValue work together", () => {
		const target = new EventTarget()
		const context = createContext<number>("test")

		// Set the context data
		setContextValue(target, context, 42)

		// Get the context data
		const data = getContextValue(target, context)

		expect(data).toBe(42)
	})
}

export { testContextSubscriptions }
