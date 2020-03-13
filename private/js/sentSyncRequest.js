const sentPostReq = function(url, request, callback, failCallback) {
  const statusOk = 200;
  fetch(url, request)
    .then(res => {
      if (res.status !== statusOk) {
        return failCallback();
      }
      return res.json();
    })
    .then(data => {
      if (!data) {
        return;
      }
      callback(data);
    });
};

const sentGetReq = function(url, callback) {
  const statusOk = 200;
  fetch(url)
    .then(res => {
      if (res.status !== statusOk) {
        return;
      }
      return res.json();
    })
    .then(data => callback(data));
};
