import Koa from 'koa';
import middlewareRegister from './middleware.js';

const app = new Koa();
const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 8000;

// Middleware
middlewareRegister(app);

// listen
const listener = require('http').createServer(app.callback());

listener.listen(port, () => {
    console.log('==> ✅  Server is listening');
    console.log('==> 🌎  host is http://%s:%s', hostname, port);
});

// Focus capture all errors
app.on('error', (err) => {
  console.log('error occured:', err.message || err.stack);
});

export default listener;
