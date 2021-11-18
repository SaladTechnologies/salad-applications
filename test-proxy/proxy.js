const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const WEB_APP_URL = "http://localhost:3000";
const GATSBY_URL = "http://localhost:8000";
const HOST = "localhost";
const PORT = 8080

// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
  res.send('This is a simple proxy to map requests to the webapp or gatsby service based on path.');
});

// Proxy endpoints
app.use('/app', createProxyMiddleware({
  target: WEB_APP_URL,
  changeOrigin: true
}));

app.use("", createProxyMiddleware({
  target: GATSBY_URL,
  changeOrigin: true
}))

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`)
})
