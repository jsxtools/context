import type { ContextConsumerMixin, ContextProviderMixin } from "../../mixins.ts"

import { expect, test, vi } from "vitest"

const testContextMixins = (
	/** Class to create context request event. */
	ContextConsumerMixinFactory: () => typeof ContextConsumerMixin,

	/** Factory to create the context creator. */
	ContextProviderMixinFactory: () => typeof ContextProviderMixin,
) => {
	test("Context Listeners without subscriptions", () => {
		const ContextConsumerMixin = ContextConsumerMixinFactory()
		const ContextProviderMixin = ContextProviderMixinFactory()

		class ContextTarget extends ContextProviderMixin(ContextConsumerMixin(EventTarget)) {}

		const target = new ContextTarget()

		const context = "test"
		const data = { awesome: "blossom" }
		const callback = vi.fn()

		target.setContextValue(context, data)
		target.addContextListener(context, callback)

		expect(callback).toHaveBeenCalledTimes(1)

		target.setContextValue(context, data)

		expect(callback).toHaveBeenCalledTimes(1)
	})

	test("Context Listeners with subscriptions", () => {
		const RequestContextMixin = ContextConsumerMixinFactory()
		const SetContextValueMixin = ContextProviderMixinFactory()

		class ContextTarget extends SetContextValueMixin(RequestContextMixin(EventTarget)) {}

		const target = new ContextTarget()

		const context = "test"
		const data = { awesome: "blossom" }
		const callback = vi.fn()

		target.setContextValue(context, data)
		target.addContextListener(context, callback, true)

		expect(callback).toHaveBeenCalledTimes(1)

		target.setContextValue(context, data)

		expect(callback).toHaveBeenCalledTimes(2)

		target.removeContextListener(context, callback)
		target.setContextValue(context, data)

		expect(callback).toHaveBeenCalledTimes(2)
	})
}

export { testContextMixins }
