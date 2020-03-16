const {app} = require('./lib/routes');
const {env} = require('process');
const {log} = require('console');

const main = function(){
  const defaultPort = 8000;
  const port = env.PORT || defaultPort;
  app.listen(port, () => log(`Server listening at ${port}`));
}; 

main();
