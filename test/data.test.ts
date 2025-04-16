/// <reference types="@vitest/browser/matchers" />

import { expect, test } from "vitest"
import { ContextRequestEvent, createContext, getContextData, setContextData } from "../src/data.ts"

test("ContextRequestEvent constructor and properties", () => {
	const callback = () => {}
	const event = new ContextRequestEvent("test", callback, true)

	expect(event.context).toBe("test")
	expect(event.callback).toBe(callback)
	expect(event.subscribe).toBe(true)
	expect(event.type).toBe("context-request")
	expect(event.bubbles).toBe(true)
	expect(event.composed).toBe(true)
})

test("createContext creates a branded context", () => {
	const context = createContext<string, number>("test")

	expect(context).toBe("test")
})

test("getContextData and setContextData work together", () => {
	const context = createContext<string, number>("test")

	// Set the context data
	setContextData(context, 42)

	// Get the context data
	const data = getContextData(context)

	expect(data).toBe(42)
})
