
const expect = require('chai').expect;
const packageJson = require('../package.json');

describe('package.json', () => {
  it('has the correct dependencies', () => {
   expect(Object.keys(packageJson.dependencies)).to.include.members([
     'express',
     'body-parser',
     'request-promise',
   ]);
  });

  it('has the correct devDependencies', () => {
   expect(Object.keys(packageJson.devDependencies)).to.include.members([
     'chai',
     'mocha',
     'mocha-multi',
     'supertest',
     'unexpected',
   ]);
  });
});
