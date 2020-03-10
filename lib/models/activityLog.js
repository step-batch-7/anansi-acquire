class ActivityLog {
  constructor() {
    this.activities = [];
  }

  addLog(type, text) {
    this.activities.unshift({type, text});
  }

  get logs() {
    return this.activities.slice();
  }
}

module.exports = ActivityLog;
