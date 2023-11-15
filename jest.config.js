module.exports = {
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/babelTransform.js',
  },
  testEnvironment: 'jsdom',
};
