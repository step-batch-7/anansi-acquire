class ActivityLog {
  constructor() {
    this.activities = [];
  }

  addLog(type, text) {
    this.activities.push({type, text});
  }

  get logs() {
    return this.activities.slice();
  }
}

module.exports = ActivityLog;
