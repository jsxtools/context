# Context

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Coverage][cov-img]][cov-url]

**Context** is a fully-typed [context-protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md), which also provides a basic implementation to manage and share context data across elements.

## Features

- 🎨 **TypeScript Support**: Full type safety and autocompletion
- 🚀 **Zero Dependencies**: Lightweight and framework-agnostic
- 📦 **Tree-shakeable**: Only import what you need
- 🎨 **Fully Covered**: Full 100% test coverage

## Installation

```shell
npm install @jsxtools/context
```

## Usage

```ts
import { ContextRequestEvent } from "@jsxtools/context"

new ContextRequestEvent("test", (data) => {
  // do something with data
})
```

### Creating Context and Accessing Context Data

```typescript
import { createContext, setContextData, getContextData } from "@jsxtools/context/data"

// create a context with a key and value type
const themeContext = createContext<"theme", "light" | "dark">("theme")

// set context data as "dark"
setContextData(themeContext, "dark")

// get context data — returns "dark"
const theme = getContextData(themeContext)
```

## API Reference

**From any `@jsxtools/context` import**:

### Types

- `Context<K, V>`: Branded context type with key `K` and value type `V`
- `ContextData<T>`: Extracts the value type from a context
- `ContextKey<T>`: Extracts the key type from a context
- `ContextCallback<T>`: Callback function type for context consumers

### Events

- `context-request`: Event fired when a component requests context data

### Classes

- `ContextRequestEvent<T>`: Class used to dispatch context requests.

**From `@jsxtools/context/data`**:

### Data Functions

- `createContext<K, V>(key: K)`: Creates a new context with the given key
- `getContextData<T>(context: T, target?: EventTarget)`: Retrieves context data
- `setContextData<T>(context: T, value: ContextData<T>, target?: EventTarget)`: Sets context data

**From `@jsxtools/context/subscribers`**:

### Subcriber Functions

- `createContext<K, V>(key: K)`: Creates a new context with the given key
- `getContextData<T>(context: T, target?: EventTarget)`: Retrieves context data
- `setContextData<T>(context: T, value: ContextData<T>, target?: EventTarget)`: Sets context data

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b your/amazing-feature`)
3. Commit your changes (`git commit -m "Add some amazing feature"`)
4. Push to the branch (`git push origin your/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT No Attribution License](https://opensource.org/license/mit-0).

[npm-img]: https://img.shields.io/npm/v/@jsxtools/context
[npm-url]: https://www.npmjs.com/package/@jsxtools/context
[cli-img]: https://github.com/jsxtools/context/actions/workflows/check.yml/badge.svg
[cli-url]: https://github.com/jsxtools/context/actions/workflows/check.yml
[cov-img]: https://codecov.io/gh/jsxtools/context/graph/badge.svg
[cov-url]: https://codecov.io/gh/jsxtools/context
