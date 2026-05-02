/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports',
        outputName: 'server-junit.xml',
      },
    ],
  ],
};
