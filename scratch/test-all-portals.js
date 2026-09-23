const http = require('http');

function checkUrl(url, label, expectedStrings) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n=== Checking: ${label} (${url}) ===`);
        console.log(`HTTP Status: ${res.statusCode}`);
        let passed = true;
        for (const str of expectedStrings) {
          const found = data.includes(str);
          console.log(`Contains "${str}": ${found ? 'PASS' : 'FAIL'}`);
          if (!found) passed = false;
        }
        resolve(passed && res.statusCode === 200);
      });
    }).on('error', (err) => {
      console.error(`Error requesting ${url}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  const t1 = await checkUrl('http://localhost:3000/login?portal=student', 'Student Login Section', [
    'Sign in with Google',
    'Sign in with Facebook',
    'Sign in with Twitter',
    'Sign up with email',
    'Demo: student@demo.com',
    'Create account',
    'Terms of service'
  ]);

  const t2 = await checkUrl('http://localhost:3000/institute/login', 'College/Institute Login Section', [
    'Sign in with Google',
    'Sign in with Facebook',
    'Sign in with Twitter',
    'Sign up with email',
    'Demo: institute@demo.com',
    'Create account',
    'Terms of service'
  ]);

  const t3 = await checkUrl('http://localhost:3000/company/login', 'Company Login Section', [
    'Sign in with Google',
    'Sign in with Facebook',
    'Sign in with Twitter',
    'Sign up with email',
    'Demo: company@demo.com',
    'Create account',
    'Terms of service'
  ]);

  const t4 = await checkUrl('http://localhost:3000/login', 'Portal Gateway Screen', [
    'Student Portal',
    'Institute Portal',
    'Company Portal',
    'Select Your Portal'
  ]);


  console.log('\n=======================================');
  console.log(`OVERALL RESULT: ${t1 && t2 && t3 && t4 ? 'ALL PASSED!' : 'SOME FAILED'}`);
  console.log('=======================================');
}

run();
