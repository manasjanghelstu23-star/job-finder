const http = require("http");

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          json: () => {
            try {
              return JSON.parse(data);
            } catch (e) {
              return null;
            }
          },
        });
      });
    });
    req.on("error", reject);
    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log("==================================================");
  console.log("VERIFYING ALL BUTTONS & AUTH ACROSS ALL 3 PORTALS");
  console.log("==================================================\n");

  const results = [];
  const timestamp = Date.now();

  // Test 1: Student OAuth - Google
  try {
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/oauth/google",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { portal: "student" }
    );
    const json = res.json();
    const passed = res.statusCode === 200 && json?.success && json?.role === "student" && res.headers["set-cookie"];
    results.push({ test: "Student Portal: Sign in with Google", passed, detail: json?.redirectUrl });
  } catch (e) {
    results.push({ test: "Student Portal: Sign in with Google", passed: false, detail: e.message });
  }

  // Test 2: Student OAuth - Facebook
  try {
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/oauth/facebook",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { portal: "student" }
    );
    const json = res.json();
    const passed = res.statusCode === 200 && json?.success && json?.role === "student";
    results.push({ test: "Student Portal: Sign in with Facebook", passed, detail: json?.redirectUrl });
  } catch (e) {
    results.push({ test: "Student Portal: Sign in with Facebook", passed: false, detail: e.message });
  }

  // Test 3: Student OAuth - Twitter
  try {
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/oauth/twitter",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { portal: "student" }
    );
    const json = res.json();
    const passed = res.statusCode === 200 && json?.success && json?.role === "student";
    results.push({ test: "Student Portal: Sign in with Twitter", passed, detail: json?.redirectUrl });
  } catch (e) {
    results.push({ test: "Student Portal: Sign in with Twitter", passed: false, detail: e.message });
  }

  // Test 4: Institute OAuth - Google
  try {
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/oauth/google",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { portal: "institute" }
    );
    const json = res.json();
    const passed = res.statusCode === 200 && json?.success && json?.role === "institute";
    results.push({ test: "Institute Portal: Sign in with Google", passed, detail: json?.redirectUrl });
  } catch (e) {
    results.push({ test: "Institute Portal: Sign in with Google", passed: false, detail: e.message });
  }

  // Test 5: Company OAuth - Google
  try {
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/oauth/google",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { portal: "company" }
    );
    const json = res.json();
    const passed = res.statusCode === 200 && json?.success && json?.role === "company";
    results.push({ test: "Company Portal: Sign in with Google", passed, detail: json?.redirectUrl });
  } catch (e) {
    results.push({ test: "Company Portal: Sign in with Google", passed: false, detail: e.message });
  }

  // Test 6: Sign up with email (Student)
  try {
    const email = `new.student.${timestamp}@example.com`;
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/signup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Test New Student",
        email,
        password: "password123",
        role: "STUDENT",
      }
    );
    const json = res.json();
    const passed = res.statusCode === 201 && json?.success && json?.role === "student" && res.headers["set-cookie"];
    results.push({ test: "Student Portal: Sign up with email", passed, detail: `Created: ${email}` });
  } catch (e) {
    results.push({ test: "Student Portal: Sign up with email", passed: false, detail: e.message });
  }

  // Test 7: Sign up with email (Institute)
  try {
    const email = `new.institute.${timestamp}@institute.edu`;
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/signup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Test Institute Academy",
        email,
        password: "password123",
        role: "INSTITUTE",
      }
    );
    const json = res.json();
    const passed = res.statusCode === 201 && json?.success && json?.role === "institute";
    results.push({ test: "Institute Portal: Sign up with email", passed, detail: `Created: ${email}` });
  } catch (e) {
    results.push({ test: "Institute Portal: Sign up with email", passed: false, detail: e.message });
  }

  // Test 8: Sign up with email (Company)
  try {
    const email = `new.company.${timestamp}@enterprise.com`;
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/signup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Test Global Tech Corp",
        email,
        password: "password123",
        role: "COMPANY",
      }
    );
    const json = res.json();
    const passed = res.statusCode === 201 && json?.success && json?.role === "company";
    results.push({ test: "Company Portal: Sign up with email", passed, detail: `Created: ${email}` });
  } catch (e) {
    results.push({ test: "Company Portal: Sign up with email", passed: false, detail: e.message });
  }

  // Test 9: Demo Autofill (Student)
  try {
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "student@demo.com", password: "password123" }
    );
    const json = res.json();
    const passed = res.statusCode === 200 && json?.success && json?.user?.role === "STUDENT";
    results.push({ test: "Student Portal: Autofill button", passed, detail: "student@demo.com login OK" });
  } catch (e) {
    results.push({ test: "Student Portal: Autofill button", passed: false, detail: e.message });
  }

  // Test 10: Demo Autofill (Institute)
  try {
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "institute@demo.com", password: "password123" }
    );
    const json = res.json();
    const passed = res.statusCode === 200 && json?.success && json?.user?.role === "INSTITUTE";
    results.push({ test: "Institute Portal: Autofill button", passed, detail: "institute@demo.com login OK" });
  } catch (e) {
    results.push({ test: "Institute Portal: Autofill button", passed: false, detail: e.message });
  }

  // Test 11: Demo Autofill (Company)
  try {
    const res = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "company@demo.com", password: "password123" }
    );
    const json = res.json();
    const passed = res.statusCode === 200 && json?.success && json?.user?.role === "COMPANY";
    results.push({ test: "Company Portal: Autofill button", passed, detail: "company@demo.com login OK" });
  } catch (e) {
    results.push({ test: "Company Portal: Autofill button", passed: false, detail: e.message });
  }

  // Test 12: Page UI Rendering & Button Presence Check
  try {
    const pages = [
      { path: "/login?portal=student", name: "Student Login Page" },
      { path: "/institute/login", name: "Institute Login Page" },
      { path: "/company/login", name: "Company Login Page" },
    ];

    for (const page of pages) {
      const res = await request({
        hostname: "localhost",
        port: 3000,
        path: page.path,
        method: "GET",
      });
      const html = res.data;
      const hasGoogle = html.includes("Sign in with Google");
      const hasFacebook = html.includes("Sign in with Facebook");
      const hasTwitter = html.includes("Sign in with Twitter");
      const hasEmail = html.includes("Sign up with email");
      const hasAutofill = html.includes("Autofill");
      const hasCreateAccount = html.includes("Create account");
      const hasTerms = html.includes("Terms of service");

      const passed = res.statusCode === 200 && hasGoogle && hasFacebook && hasTwitter && hasEmail && hasAutofill && hasCreateAccount && hasTerms;
      results.push({
        test: `${page.name}: All 7 Buttons Present in Rendered UI`,
        passed,
        detail: `Status: ${res.statusCode}, Google: ${hasGoogle}, FB: ${hasFacebook}, Twitter: ${hasTwitter}, Email: ${hasEmail}, Autofill: ${hasAutofill}, Terms: ${hasTerms}`,
      });
    }
  } catch (e) {
    results.push({ test: "Page UI Rendering Check", passed: false, detail: e.message });
  }

  // Summary
  console.log("--------------------------------------------------");
  let allPassed = true;
  for (const r of results) {
    const symbol = r.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${symbol} | ${r.test} -> ${r.detail}`);
    if (!r.passed) allPassed = false;
  }
  console.log("--------------------------------------------------");
  console.log(`TOTAL TESTS: ${results.length}`);
  console.log(`STATUS: ${allPassed ? "ALL TESTS PASSED SUCCESSFULLY!" : "SOME TESTS FAILED"}`);
  console.log("==================================================");

  process.exit(allPassed ? 0 : 1);
}

run();
