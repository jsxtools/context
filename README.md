# Context Protocol

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Coverage][cov-img]][cov-url]

**Context Protocol** is a fully-typed implementation of the [Context Protocol Proposal][spec-url], providing a robust way to manage and share context across web components and DOM elements.

## Features

- 🚀 **Fully Typed**: Full TypeScript support with comprehensive type safety and autocompletion.
- 🧠 **Fully Tested**: 100% test coverage ensuring reliability.
- 📦 **Tree-shakeable**: Import only what you need to keep your bundle size minimal.
- 🎯 **Framework Agnostic**: Works with any web framework or vanilla JavaScript.
- 🔄 **Reactive**: Additional subscription helpers for real-time context updates.
- 🛠️ **Mixable**: Easy integration with custom elements via mixin helpers.

## Installation

```shell
npm install context-protocol
```

## Basic Usage

At its core, **Context Protocol** gives you a fully-typed implementation of the [Context Protocol Proposal](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md), ready to use however you need.

```ts
import { ContextRequestEvent, createContext } from "context-protocol"

// create a context for theme management
const themeContext = createContext<"light" | "dark">("theme")

document.dispatchEvent(
  new ContextRequestEvent(themeContext, (value, unsubscribe) => {
    // do stuff with the context value
  }, true)
)
```

Use this low-level API with absolutely any library or framework that supports the [protocol][spec-url] — or build your own tools on top of it.
Looking for a batteries-included solution instead?
We’ve got you covered.

## Quick Start

Need live context updates?
Use these helpers to get and set real-time context values.

```ts
import {
  createContext,
  setContextValue,
  getContextValue
} from "context-protocol/subscriptions"

// create a context for theme management
const themeContext = createContext<"light" | "dark">("theme")

// set the context value
setContextValue(document, themeContext, "dark")

// get the context value
const theme = getContextValue(document, themeContext)

console.log(theme) // "dark"
```

Want to respond to changes?
Use these listeners to react as context updates happen.

```ts
import {
  createContext,
  setContextValue,
  addContextListener,
} from "context-protocol/subscriptions"

// create a context for user preferences
const userContext = createContext<{ name: string; age: number }>("user")

// set up a listener for user changes
addContextListener(document.body, userContext, (user, unsubscribe) => {
  console.log(`User updated: ${user.name} (${user.age})`)
  
  // unsubscribe when needed
  if (user.age > 950) unsubscribe()
}, true)

// update user data
setContextValue(document, userContext, { name: "Noah", age: 600 })
```

Jump to:

- [Context Creation](#context-creation)
- [Context Providers and Consumers](#providers-and-consumers)
- [Context Subscriptions](#subscriptions)
- [Context Mixins](#advanced-usage-using-mixins)
- [API Reference](#api-reference)

---

## Core Concepts

### Context Creation

```ts
// create a context with a specific value type
const themeContext = createContext<"light" | "dark">("theme")

// the value type can be anything
const userContext = createContext<{ name: string }>("user")
```

### Providers and Consumers

You can set a value on _any target_, then retreive that value _at any time_ from the target or _any of its descendants_.

```ts
setContextValue(document, context, value)

getContextValue(document.body, context) // returns value
```

### Subscriptions

You can subscribe to context changes on any target, and remove the listener when it’s no longer needed.

```ts
const callback = (value, unsubscribe) => {
  // handle value changes
}

// listen now
addContextListener(element, context, callback, true)

// stop listening later
removeContextListener(element, context, callback)
```

[Skip ahead to learn how the `addContextListener` works](#subscription-methods).

## Advanced Usage: Using Mixins

```ts
import { ContextConsumerMixin, ContextProviderMixin, createContext } from "context-protocol/mixins"

type Theme = "light" | "dark"
const themeContext = createContext<Theme>("light")

// create a custom element that provides context
class ThemeProvider extends ContextProviderMixin(HTMLElement) {
  setTheme(theme: Theme) {
    this.setContextValue(themeContext, theme)
  }
}

// create a custom element that consumes context
class ThemeAwareElement extends ContextConsumerMixin(HTMLElement) {
  connectedCallback() {
    this.addContextListener(themeContext, (theme) => {
      this.style.backgroundColor = theme === "dark" ? "#333" : "#fff"
    })
  }
}
```

---

## API Reference

### createContext

Creates a new context identifier, scoped by a unique key and associated with a value type.
This key is used to share and consume values through the Context Protocol.

```ts
createContext<ValueType>(key: unknown): Context<unknown, ValueType>
```

**Type Parameters:**

- **ValueType** (`unknown`) <br />
  The type of the value associated with the context, ensuring type safety to providers and consumers.

**Parameters:**

- **key** (`unknown`) <br />
  A key used to identify the context — typically a string, symbol, or object.

**Returns:**

- **context** (`Context<typeof key, ValueType>`) <br />
  A branded context object used for matching providers and consumers.

### getContextValue

Retrieves the current value of a given context from a consumer node.
This is a one-time lookup and does not subscribe to future updates.

```ts
getContextValue<T>(
  consumer: EventTarget,
  context: T,
): void
```

**Type Parameters:**

- **T** (`unknown`) <br />
  The context key or the branded context type returned by [`createContext()`](#createcontext).

**Parameters:**

- **consumer** (`EventTarget`) <br />
  The element or node requesting the context. The protocol will walk up the tree to find a matching provider.
- **context** (`T` as `Context`) <br />
  The context key or the branded context type returned by [`createContext()`](#createcontext).

**Returns:**

- **value** (`ContextType<T> | undefined`) <br />
  The resolved value from the nearest matching provider, or `undefined` if no value is found.

### setContextValue

Delivers a value to a context, making it available to any matching consumers.
If the consumer has subscribed to updates, its callback will be invoked immediately and again on future updates.

```ts
setContextValue<T>(
  provider: EventTarget,
  context: T,
  value: ContextType<T>
): void
```

**Type Parameters:**

- **T** (`unknown`) <br />
  The context key or the branded context type returned by [`createContext()`](#createcontext).

**Parameters:**

- **provider** (`EventTarget`) <br />
  The element or node acting as the context provider. Listeners will be attached here to respond to context requests.
- **context** (`T` as `Context`) <br />
  The context key or the branded context type returned by [`createContext()`](#createcontext).

<br />

<p align="center"><strong>Subscription Methods</strong></p>

### addContextListener

Registers a callback to receive context values delivered to a specific target.

```ts
addContextListener<T>(
  consumer: EventTarget,
  context: ExtractContext<T>,
  callback: ContextCallback<ContextType<T>>,
  subscribe?: boolean,
): void
```

**Type Parameters:**

- **T** (`unknown`) <br />
  The context key or the branded context type returned by [`createContext()`](#createcontext).

**Parameters:**

- **consumer** (`EventTarget`) <br />
  The element or node that should receive the context. This is typically a DOM node that wants to consume a value.
- **context** (`T` as `Context`) <br />
  The context key or the branded context type returned by [`createContext()`](#createcontext).
- **callback** (`(value: T, unsubscribe?: () => void) => void`) <br />
  A function invoked with the resolved context value. If subscribe is true, the callback may be re-invoked when the context value changes. The callback receives an unsubscribe function if a subscription was made.
- **subscribe** (`boolean`, optional) <br />
  If true, the callback will be subscribed to future updates to this context. Defaults to false.

### removeContextListener

Unregisters a previously registered context listener.

```ts
removeContextListener<T>(
  consumer: EventTarget,
  context: T,
  callback: ContextCallback<ContextType<T>>,
): void
```

**Type Parameters:**

- **T** (`unknown`) <br />
  The context key or the branded context type returned by [`createContext()`](#createcontext).

**Parameters:**

- **consumer** (`EventTarget`) <br />
  The element or node from which the listener should be removed.
- **context** (`T` as `Context`) <br />
  The context key or branded context type originally used.
- **callback** (`(value: T, unsubscribe?: () => void) => void`) <br />
  The callback function to remove. This _must_ match the exact reference passed to addContextListener.

<br />

<p align="center"><strong>Subscription Mixins</strong></p>

### ContextConsumerMixin

A mixin that equips any `EventTarget` class (like **Custom Elements**) with methods to consume context values.

```ts
ContextConsumerMixin<T extends EventTargetConstructor>(Target: T): T & ContextConsumerMixin.Constructor
```

**Type Parameters:**

- **T** (`EventTargetConstructor`) <br />
  A constructor function that returns an `EventTarget` instance. Commonly used with `HTMLElement`.

**Returns:**

- **ConsumerTarget** (`T & ContextConsumerMixin.Constructor`) <br />
  A class extended with consumer methods for context.

**Adds the following methods:**

- `addContextListener(context, callback, subscribe?)` <br />
  Subscribes to a context value. Optionally listens for future updates.
- `removeContextListener(context, callback)` <br />
  Unsubscribes a previously registered callback.

### ContextProviderMixin

A mixin that equips any `EventTarget` class (like **Custom Elements**) with a method to provide context values to matching consumers.

```ts
ContextProviderMixin<T extends EventTargetConstructor>(Target: T): T & ContextProviderMixin.Constructor
```

**Type Parameters:**

- **T** (`EventTargetConstructor`) <br />
  A constructor function that returns an `EventTarget` instance. Commonly used with `HTMLElement`.

**Returns:**

- **ProviderTarget** (`T & ContextProviderMixin.Constructor`) <br />
  A class extended with provider methods for context.

**Adds the following methods:**

- `setContextValue(context, value)` <br />
  Provides a value to the given context, delivering it to all matching consumers.

---

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT No Attribution License](https://opensource.org/license/mit-0).

[npm-img]: https://img.shields.io/npm/v/context-protocol
[npm-url]: https://www.npmjs.com/package/context-protocol
[cli-img]: https://github.com/jsxtools/context/actions/workflows/check.yml/badge.svg
[cli-url]: https://github.com/jsxtools/context/actions/workflows/check.yml
[cov-img]: https://codecov.io/gh/jsxtools/context/graph/badge.svg
[cov-url]: https://codecov.io/gh/jsxtools/context
[spec-url]: https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md
