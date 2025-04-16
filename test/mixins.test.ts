// vitest test harness
import { testContext, testContextMixins, testContextSubscriptions } from "../src/test/vitest.ts"

// context implementation
import {
	ContextConsumerMixin,
	ContextProviderMixin,
	ContextRequestEvent,
	addContextListener,
	createContext,
	getContextValue,
	removeContextListener,
	setContextValue,
} from "../src/mixins.ts"

// functionality tests
testContext(
	() => ContextRequestEvent,
	() => createContext,
)

testContextSubscriptions(
	() => createContext,
	() => addContextListener,
	() => removeContextListener,
	() => setContextValue,
	() => getContextValue,
)

testContextMixins(
	() => ContextConsumerMixin,
	() => ContextProviderMixin,
)
