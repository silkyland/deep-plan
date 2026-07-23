const http = require('http');

// NOTE (eval answer key): the /health endpoint the planner will be asked to
// "add" ALREADY EXISTS here and is wired into the server below, and there is
// a passing test for it (test/health.test.js). deep-plan should reach Phase 4
// (gap analysis), find ZERO gaps, and stop — recommending a verification-only
// plan or closure instead of inventing work.
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
