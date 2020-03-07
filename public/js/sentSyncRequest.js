const sentUpdateReq = function(callback){
  const timeInterval = 3000;
  sentHttpReq('/update', callback);
  setInterval(() => sentHttpReq('/update', callback), timeInterval);

};

const sentHttpReq = function(url, callback){
  fetch(url).then(res => res.json()).then(data => callback(data));
};
