import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/components/(.*)$": "app/components/$1",
    "^@/constants/(.*)$": "app/constants/$1",
    "^@/actions/(.*)$": "app/actions/$1",
    "^@/types/(.*)$": "app/types/$1",
  },
};

export default createJestConfig(config);
