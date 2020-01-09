module.exports = {
  testMatch: ["**/?(*.)+(spec|test).[t]s"],
  testPathIgnorePatterns: ["/node_modules/", "lib"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};
