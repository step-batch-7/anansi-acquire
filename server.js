const {app} = require('./lib/routes');
const {env} = require('process');

const defaultPort = 8000;
const port = env.PORT || defaultPort;

const main = function() {
  app.listen(port, () => console.log(`Server listening at ${port}`));
};

main();
