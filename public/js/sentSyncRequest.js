const sentUpdateReq = function(callback){
  const timeInterval = 3000;
  setInterval(() => sentHttpReq('/update', callback), timeInterval);

};

const sentHttpReq = function(url, callback){
  fetch(url).then(res => res.json()).then(data => callback(data));
};
