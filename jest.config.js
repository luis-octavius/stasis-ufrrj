/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Use jsdom for testing React components that depend on the DOM
  testEnvironment: 'jsdom',
  // Add this if you're using path aliases in your tsconfig.json (like "@/")
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Setup files can be useful for global configurations like @testing-library/jest-dom
   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Assuming you have a jest.setup.ts
};
