module.exports = {
  testMatch: ["**/?(*.)+(spec|test).[t]s"],
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,mjs,ts}", "!(src/typings)"],
};
