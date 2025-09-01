export default {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
	testMatch: [
		"<rootDir>/src/**/__tests__/**/*.{js,jsx}",
		"<rootDir>/src/**/*.{test,spec}.{js,jsx}",
	],
	collectCoverageFrom: [
		"src/**/*.{js,jsx}",
		"!src/**/*.d.ts",
		"!src/main.jsx",
		"!src/index.css",
	],
	extensionsToTreatAsEsm: [".jsx"],
	transformIgnorePatterns: ["node_modules/(?!(@testing-library)/)"],
	transform: {
		"^.+\\.(js|jsx)$": [
			"babel-jest",
			{
				presets: [
					["@babel/preset-env", { modules: "commonjs" }],
					["@babel/preset-react", { runtime: "automatic" }],
				],
			},
		],
	},
	moduleFileExtensions: ["js", "jsx", "json"],
	testPathIgnorePatterns: ["<rootDir>/node_modules/"],
};
