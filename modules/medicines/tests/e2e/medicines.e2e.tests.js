'use strict';

describe('Medicines E2E Tests:', function () {
  describe('Test Medicines page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/medicines');
      expect(element.all(by.repeater('medicine in medicines')).count()).toEqual(0);
    });
  });
});
