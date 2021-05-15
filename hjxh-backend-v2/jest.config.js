module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: [
    "jest-extended",
    "./jest.config.js"
]
};
