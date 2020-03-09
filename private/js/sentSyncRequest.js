const sentPostReq = function(url, request, callback){
  fetch(url, request).then(res => res.json()).then(data => callback(data));
};

const sentGetReq = function(url, callback){
  fetch(url).then(res => res.json()).then(data => callback(data));
};
