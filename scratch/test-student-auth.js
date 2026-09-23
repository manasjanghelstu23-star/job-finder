const http = require('http');

const postData = JSON.stringify({
  email: 'student@demo.com',
  password: 'password123'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    console.log('Set-Cookie:', res.headers['set-cookie']);
  });
});

req.write(postData);
req.end();
