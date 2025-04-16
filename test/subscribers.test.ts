/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/expect" />

import { expect, test, vi } from "vitest"
import { createContext, observeContext, provideContext } from "../src/subscribers.ts"

test("createContext creates a branded context", () => {
	const context = createContext<string, number>("test")

	expect(context).toBe("test")
})

test("ContextRequestEvent constructor and properties", () => {
	let receivedData: unknown
	let receivedUnsubscribe: (() => void) | undefined

	const context = "test"
	const callback = vi.fn((data: unknown, unsubscribe?: () => void) => {
		receivedData = data
		receivedUnsubscribe = unsubscribe
	})
	const error = new Error("error")
	const throwing = vi.fn(() => {
		throw error
	})
	const data = { key: "value" }

	provideContext(context, data)

	expect(callback).toHaveBeenCalledTimes(0)
	expect(throwing).toHaveBeenCalledTimes(0)
	expect(receivedData).toBe(undefined)

	// requesting subscription for a provided subscription should invoke the callback
	observeContext(context, callback)

	expect(callback).toHaveBeenCalledTimes(1)
	expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
	expect(receivedData).toBe(data)

	// providiving data should invoke the callback again
	provideContext(context, data)

	expect(callback).toHaveBeenCalledTimes(2)
	expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
	expect(receivedData).toBe(data)

	// requesting a subscription again should not invoke the callback
	observeContext(context, callback)
	observeContext(context, callback)
	observeContext(context, callback)

	expect(callback).toHaveBeenCalledTimes(2)
	expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
	expect(receivedData).toBe(data)

	// requesting another context subscription should not invoke the callback
	observeContext("another-context", callback)
	observeContext("another-context", callback)
	observeContext("another-context", callback)

	expect(callback).toHaveBeenCalledTimes(2)
	expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
	expect(receivedData).toBe(data)

	// providing another context data should not invoke the callback
	provideContext("yet-another-context", data)
	provideContext("yet-another-context", data)
	provideContext("yet-another-context", data)

	expect(callback).toHaveBeenCalledTimes(2)
	expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
	expect(receivedData).toBe(data)

	// unsubscribe the callback
	expect(receivedUnsubscribe).toBeDefined()
	expect(receivedUnsubscribe!()).toBeUndefined()

	// re-initialize the subscription
	provideContext(context, data)
	observeContext(context, callback)

	// re-initializing the subscription should invoke the callback again
	expect(callback).toHaveBeenCalledTimes(3)
	expect(callback).toHaveBeenCalledWith(receivedData, receivedUnsubscribe)
	expect(receivedData).toBe(data)

	// requesting a subscription with a thrower should invoke the thrower
	observeContext(context, throwing)

	expect(throwing).toHaveBeenCalledTimes(1)
	expect(throwing).toThrowError(error)
})
