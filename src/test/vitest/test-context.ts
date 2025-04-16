import type { Context, ContextRequestEvent } from "../../context.ts"

import { expect, test } from "vitest"

const testContext = (
	/** Class to create context request event. */
	classFactory: () => typeof ContextRequestEvent,

	/** Factory to create the context creator. */
	createFactory: () => <ValueType>(key: unknown) => Context<typeof key, ValueType>,
) => {
	const ContextRequestEvent = classFactory()
	const createContext = createFactory()

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
		const context = createContext<number>("test")

		expect(context).toBe("test")
	})
}

export { testContext }
