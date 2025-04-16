/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/expect" />

import { expect, test } from "vitest"
import { ContextRequestEvent, createContext } from "../src/context.ts"

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
