const http = require('http');

function postJson(path, body, headers = {}) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...headers,
      },
    }, (res) => {
      let respData = '';
      res.on('data', chunk => respData += chunk);
      res.on('end', () => {
        let json = {};
        try { json = JSON.parse(respData); } catch (e) { json = { raw: respData }; }
        resolve({ status: res.statusCode, headers: res.headers, data: json });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.write(data);
    req.end();
  });
}

function getJson(path, headers = {}) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'GET',
      headers,
    }, (res) => {
      let respData = '';
      res.on('data', chunk => respData += chunk);
      res.on('end', () => {
        let json = {};
        try { json = JSON.parse(respData); } catch (e) { json = { raw: respData }; }
        resolve({ status: res.statusCode, headers: res.headers, data: json });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.end();
  });
}

async function runTests() {
  console.log('=== 1. TEST POST /api/auth/signup ===');
  const uniqueEmail = `test.student.${Date.now()}@example.com`;
  const signupRes = await postJson('/api/auth/signup', {
    name: 'Ananya Sharma',
    email: uniqueEmail,
    password: 'password123',
    role: 'STUDENT',
  });
  console.log('Signup Status:', signupRes.status);
  console.log('Signup Success:', signupRes.data.success);
  console.log('User Role:', signupRes.data.role);
  console.log('Token Received:', Boolean(signupRes.data.token));
  const studentToken = signupRes.data.token;
  const cookieHeader = signupRes.headers['set-cookie'] ? signupRes.headers['set-cookie'][0].split(';')[0] : '';

  console.log('\n=== 2. TEST POST /api/auth/login ===');
  const loginRes = await postJson('/api/auth/login', {
    email: uniqueEmail,
    password: 'password123',
  });
  console.log('Login Status:', loginRes.status);
  console.log('Login Success:', loginRes.data.success);
  console.log('User Name:', loginRes.data.user?.name);

  console.log('\n=== 3. TEST POST /api/auth/oauth/google ===');
  const googleRes = await postJson('/api/auth/oauth/google', { portal: 'student' });
  console.log('Google OAuth Status:', googleRes.status);
  console.log('Google OAuth User:', googleRes.data.user?.email);
  console.log('Google OAuth Redirect:', googleRes.data.redirectUrl);

  console.log('\n=== 4. TEST POST /api/auth/oauth/facebook ===');
  const fbRes = await postJson('/api/auth/oauth/facebook', { portal: 'student' });
  console.log('Facebook OAuth Status:', fbRes.status);
  console.log('Facebook OAuth User:', fbRes.data.user?.email);

  console.log('\n=== 5. TEST POST /api/auth/oauth/twitter ===');
  const twitterRes = await postJson('/api/auth/oauth/twitter', { portal: 'student' });
  console.log('Twitter OAuth Status:', twitterRes.status);
  console.log('Twitter OAuth User:', twitterRes.data.user?.email);

  console.log('\n=== 6. TEST GET /api/auth/me (Bearer Token) ===');
  const meRes = await getJson('/api/auth/me', {
    Authorization: `Bearer ${studentToken}`,
  });
  console.log('/api/auth/me Status:', meRes.status);
  console.log('/api/auth/me User:', meRes.data.user?.email);
  console.log('/api/auth/me Profile FullName:', meRes.data.user?.profile?.fullName);

  console.log('\n=== 7. TEST GET /api/student/dashboard (Authorized Student) ===');
  const dashRes = await getJson('/api/student/dashboard', {
    Authorization: `Bearer ${studentToken}`,
  });
  console.log('Dashboard Status:', dashRes.status);
  console.log('Dashboard Profile Completion:', dashRes.data.profileCompletion + '%');
  console.log('Dashboard Skills Count:', dashRes.data.skills?.length);
  console.log('Dashboard Recommended Ops:', dashRes.data.recommendedOpportunities?.length);

  console.log('\n=== 8. TEST GET /api/student/dashboard (No Token - Expect 401) ===');
  const unauthRes = await getJson('/api/student/dashboard');
  console.log('Unauth Status (Expected 401):', unauthRes.status);

  console.log('\n=== 9. TEST GET /api/student/dashboard (Company Token - Expect 403) ===');
  const companyOAuth = await postJson('/api/auth/oauth/google', { portal: 'company' });
  const companyDash = await getJson('/api/student/dashboard', {
    Authorization: `Bearer ${companyOAuth.data.token}`,
  });
  console.log('Company trying to access student dashboard (Expected 403):', companyDash.status);

  console.log('\n=== 10. TEST GET /api/student/profile ===');
  const profRes = await getJson('/api/student/profile', {
    Authorization: `Bearer ${studentToken}`,
  });
  console.log('Student Profile Status:', profRes.status);
  console.log('Student Profile Degree:', profRes.data.student?.degree);
  console.log('Student Profile CGPA:', profRes.data.student?.cgpa);
  console.log('Student Profile Skills Count:', profRes.data.skills?.length);

  console.log('\n=======================================');
  const allPassed =
    (signupRes.status === 200 || signupRes.status === 201) &&
    loginRes.status === 200 &&
    googleRes.status === 200 &&
    fbRes.status === 200 &&
    twitterRes.status === 200 &&
    meRes.status === 200 &&
    dashRes.status === 200 &&
    unauthRes.status === 401 &&
    companyDash.status === 403 &&
    profRes.status === 200;
  console.log(`TEST SUITE RESULT: ${allPassed ? 'ALL 10 TESTS PASSED!' : 'SOME FAILED'}`);
  console.log('=======================================');
}

runTests();
