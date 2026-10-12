"use strict";

module.exports = {
    displayName: "opportunity-actions-pilot",
    rootDir: ".",
    roots: ["<rootDir>/OpportunityActionsControl"],
    testMatch: ["**/*.test.ts", "**/*.test.tsx"],
    testEnvironment: "node",
    globalSetup: "<rootDir>/tests/prepare-types.cjs",
    transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.test.json" }]
    },
    clearMocks: true,
    collectCoverageFrom: ["OpportunityActionsControl/**/*.{ts,tsx}", "!**/*.test.*", "!**/generated/**"],
    coverageDirectory: "coverage"
};