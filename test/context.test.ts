// vitest test harness
import { testContext } from "../src/test/vitest.ts"

// context implementation
import { ContextRequestEvent, createContext } from "../src/context.ts"

// functionality tests
testContext(
	() => ContextRequestEvent,
	() => createContext,
)
