// vitest test harness
import { testContext, testContextSubscriptions } from "../src/test/vitest.ts"

// context implementation
import { ContextRequestEvent, addContextListener, createContext, getContextValue, removeContextListener, setContextValue } from "../src/subscriptions.ts"

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
