const http = require('http');

function handler(req, res) {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(404);
  res.end();
}

const server = http.createServer(handler);

if (require.main === module) {
  server.listen(process.env.PORT || 3000);
}

module.exports = { handler, server };
