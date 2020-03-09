class ActivityLog {
  constructor(){
    this.activities = [{type: 'tilePlaced', text: 'Placed Initial Tiles'}];
  }

  addLog(type, text){
    this.activities.push({type, text});
  }

  get logs(){
    return this.activities.slice();
  }
}

module.exports = ActivityLog;
