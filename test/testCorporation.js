const assert = require('chai').assert;
const Corporation = require('../lib/models/corporation');

describe('Corporation', function() {
  describe('status', function() {
    it('should give status of given corporation', function() {
      const phoenix = Corporation.create('phoenix');
      const expected = {
        stocks: 25,
        area: 0,
        price: 0,
        majority: 0,
        minority: 0,
        isActive: false,
        isStable: false
      };
      assert.deepStrictEqual(phoenix.status, expected);
    });
  });
});
