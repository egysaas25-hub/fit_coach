const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/login',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`Received ${chunk.length} characters`);
  });
  res.on('end', () => {
    console.log('Page loaded successfully');
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();