export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  collectCoverageFrom: ["src/**/*.ts", "!src/cli.ts", "!src/types/**/*.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
