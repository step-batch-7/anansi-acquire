const {app} = require('./lib/routes');
const {env} = require('process');
const {log} = require('console');

const defaultPort = 8000;
const port = env.PORT || defaultPort;

const main = () => app.listen(port, () => log(`Server listening at ${port}`));

main();
