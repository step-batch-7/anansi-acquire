const assert = require('chai').assert;
const ActivityLog = require('../lib/models/activityLog.js');

describe('ActivityLog', () => {
  describe('addLog', () => {
    it('should add a given log ', () => {
      const activityLog = new ActivityLog();
      activityLog.addLog('normal', 'test');
      const expected = [
        {type: 'tilePlaced', text: 'Placed Initial Tiles'}, 
        {type: 'normal', text: 'test'}
      ];
      assert.deepStrictEqual(activityLog.logs, expected);
    });
  });
});
