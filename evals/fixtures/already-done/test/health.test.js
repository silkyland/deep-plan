const test = require('node:test');
const assert = require('node:assert');
const { handler } = require('../src/index');

test('GET /health returns 200 with status ok', () => {
  const req = { url: '/health' };
  let statusCode;
  let body = '';
  const res = {
    writeHead(code) {
      statusCode = code;
    },
    end(chunk) {
      if (chunk) body += chunk;
    },
  };
  handler(req, res);
  assert.strictEqual(statusCode, 200);
  assert.deepStrictEqual(JSON.parse(body), { status: 'ok' });
});
