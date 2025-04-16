import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
		browser: {
			enabled: true,
			headless: true,
			provider: "playwright",
			instances: [
				{
					browser: "chromium",
				},
			],
		},
		coverage: {
			provider: "v8",
			reporter: ["json", "text"],
			reportsDirectory: "./coverage",
			include: ["src/*.ts"],
			exclude: ["src/test"],
		},
	},
})
