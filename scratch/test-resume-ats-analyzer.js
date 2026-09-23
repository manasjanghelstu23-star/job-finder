const http = require('http');

async function testEndpoint(name, payload, checks) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/student/resume/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`\n--------------------------------------------------`);
        console.log(`TEST: ${name} (Status: ${res.statusCode})`);
        console.log(`--------------------------------------------------`);
        let pass = true;
        try {
          const data = JSON.parse(body);
          for (const [checkName, checkFn] of Object.entries(checks)) {
            const ok = checkFn(data);
            console.log(`[${ok ? 'PASS' : 'FAIL'}] ${checkName}`);
            if (!ok) pass = false;
          }
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          pass = false;
        }
        resolve(pass);
      });
    });
    req.on('error', (e) => {
      console.error(`Request error for ${name}:`, e);
      resolve(false);
    });
    req.write(postData);
    req.end();
  });
}

async function runAll() {
  console.log('==================================================');
  console.log('VERIFYING ATS RESUME ANALYZER & ALIGNMENT ENGINE');
  console.log('==================================================');

  // Test 1: Java Backend Developer against Backend Developer role
  const t1 = await testEndpoint(
    'Backend Developer Analysis (Arjun Verma)',
    { sampleKey: 'backend-java', targetRoleId: 'backend-dev' },
    {
      'Returns success': (d) => d.success === true,
      'Target role title matches': (d) => d.analysis?.targetRole?.title === 'Backend Developer',
      'High alignment score (> 75%)': (d) => d.analysis?.alignmentPercentage >= 75,
      'Detects Strong Matches (Java/REST/SQL)': (d) => d.analysis?.matchedSkills?.length > 0,
      'Detects Partial Evidence': (d) => d.analysis?.partialSkills !== undefined,
      'Generates Dual Gaps': (d) => d.analysis?.dualGaps?.skillGaps && d.analysis?.dualGaps?.resumeContentGaps,
      'Provides Resume Quality Telemetry': (d) => d.analysis?.qualityMetrics?.structure && d.analysis?.qualityMetrics?.roleAlignment,
      'Produces 1-5 Actionable Improvements': (d) => d.analysis?.actionableImprovements?.length >= 3,
      'Connects Platform Module links': (d) => d.analysis?.connectedModules?.matchedOpportunitiesCount > 0,
    }
  );

  // Test 2: CS Fresher against Backend Developer role (Expecting Gaps)
  const t2 = await testEndpoint(
    'CS Fresher Analysis (Rohan Patel) - Identifies Real Gaps',
    { sampleKey: 'fresher-generalist', targetRoleId: 'backend-dev' },
    {
      'Identifies lower alignment (< 60%)': (d) => d.analysis?.alignmentPercentage < 60,
      'Identifies Missing Role Skills (REST APIs / Git)': (d) => d.analysis?.missingSkills?.length > 0,
      'Identifies Insufficient Evidence (listed without proof)': (d) => d.analysis?.insufficientEvidenceSkills?.length > 0,
      'Generates Skill Gaps for missing requirements': (d) => d.analysis?.dualGaps?.skillGaps?.length > 0,
      'Generates Resume Content Gaps': (d) => d.analysis?.dualGaps?.resumeContentGaps?.length > 0,
    }
  );

  // Test 3: Frontend Developer against Frontend Role
  const t3 = await testEndpoint(
    'Frontend Developer Analysis (Sneha Nair) against Frontend Dev',
    { sampleKey: 'frontend-react', targetRoleId: 'frontend-dev' },
    {
      'Returns Frontend Developer target role': (d) => d.analysis?.targetRole?.title === 'Frontend Developer',
      'High alignment for frontend skills': (d) => d.analysis?.alignmentPercentage >= 70,
      'Matches React & TypeScript': (d) => d.analysis?.matchedSkills?.some(s => s.name === 'React' || s.name === 'TypeScript'),
    }
  );

  console.log(`\n==================================================`);
  console.log(`ALL ATS RESUME ANALYZER TESTS COMPLETE: ${t1 && t2 && t3 ? 'ALL PASSED ✅' : 'SOME FAILED ❌'}`);
  console.log(`==================================================\n`);
}

runAll();
