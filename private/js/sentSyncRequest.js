const sentPostReq = function(url, request, callback, failCallback) {
  fetch(url, request)
    .then(res => {
      if (res.status !== 200) {
        return failCallback();
      }
      return res.json();
    })
    .then(data => {
      if (!data) {
        return;
      }
      console.log(data);
      callback(data);
    });
};

const sentGetReq = function(url, callback) {
  fetch(url)
    .then(res => {
      if (res.status !== 200) {
        return;
      }
      return res.json();
    })
    .then(data => callback(data));
};
