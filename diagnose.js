/**
 * Diagnostic script to test frontend-backend connectivity
 * Run with: node diagnose.js
 */

const http = require('http');

const BACKEND_URL = 'http://localhost:8002';
const FRONTEND_URL = 'http://localhost:3000';

console.log('='.repeat(60));
console.log('Todo App Connectivity Diagnostic');
console.log('='.repeat(60));

// Test backend health
function testBackend() {
  return new Promise((resolve) => {
    console.log('\n[1/4] Testing backend connection...');
    console.log(`      URL: ${BACKEND_URL}`);

    const req = http.get(BACKEND_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('      ✓ Backend is running');
          console.log(`      Response: ${data}`);
          resolve(true);
        } else {
          console.log(`      ✗ Backend returned status ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('      ✗ Backend is NOT running');
      console.log(`      Error: ${err.message}`);
      console.log('\n      → ACTION: Start the backend with: start-backend.bat');
      resolve(false);
    });

    req.setTimeout(3000, () => {
      console.log('      ✗ Backend connection timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test frontend
function testFrontend() {
  return new Promise((resolve) => {
    console.log('\n[2/4] Testing frontend connection...');
    console.log(`      URL: ${FRONTEND_URL}`);

    const req = http.get(FRONTEND_URL, (res) => {
      if (res.statusCode === 200 || res.statusCode === 304) {
        console.log('      ✓ Frontend is running');
        resolve(true);
      } else {
        console.log(`      ✗ Frontend returned status ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log('      ✗ Frontend is NOT running');
      console.log(`      Error: ${err.message}`);
      console.log('\n      → ACTION: Start the frontend with: start-frontend.bat');
      resolve(false);
    });

    req.setTimeout(3000, () => {
      console.log('      ✗ Frontend connection timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test CORS
function testCORS() {
  return new Promise((resolve) => {
    console.log('\n[3/4] Testing CORS configuration...');

    const options = {
      hostname: 'localhost',
      port: 8002,
      path: '/',
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
      }
    };

    const req = http.request(options, (res) => {
      const corsHeader = res.headers['access-control-allow-origin'];
      if (corsHeader === 'http://localhost:3000' || corsHeader === '*') {
        console.log('      ✓ CORS is properly configured');
        console.log(`      Allow-Origin: ${corsHeader}`);
        resolve(true);
      } else {
        console.log('      ✗ CORS might be misconfigured');
        console.log(`      Allow-Origin: ${corsHeader || 'not set'}`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log('      ✗ Could not test CORS');
      console.log(`      Error: ${err.message}`);
      resolve(false);
    });

    req.setTimeout(3000, () => {
      console.log('      ✗ CORS test timeout');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test API endpoint
function testAPI() {
  return new Promise((resolve) => {
    console.log('\n[4/4] Testing API endpoint...');
    console.log('      Endpoint: /tasks (without auth)');

    const req = http.get(`${BACKEND_URL}/tasks`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 401) {
          console.log('      ✓ API endpoint is working (401 expected without auth)');
          console.log(`      Response: ${data}`);
          resolve(true);
        } else {
          console.log(`      ? Unexpected status: ${res.statusCode}`);
          console.log(`      Response: ${data}`);
          resolve(true);
        }
      });
    });

    req.on('error', (err) => {
      console.log('      ✗ API endpoint test failed');
      console.log(`      Error: ${err.message}`);
      resolve(false);
    });

    req.setTimeout(3000, () => {
      console.log('      ✗ API test timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Run all tests
async function runDiagnostics() {
  const backendOk = await testBackend();
  const frontendOk = await testFrontend();
  const corsOk = await testCORS();
  const apiOk = await testAPI();

  console.log('\n' + '='.repeat(60));
  console.log('Diagnostic Summary');
  console.log('='.repeat(60));
  console.log(`Backend:  ${backendOk ? '✓ OK' : '✗ FAIL'}`);
  console.log(`Frontend: ${frontendOk ? '✓ OK' : '✗ FAIL'}`);
  console.log(`CORS:     ${corsOk ? '✓ OK' : '✗ FAIL'}`);
  console.log(`API:      ${apiOk ? '✓ OK' : '✗ FAIL'}`);

  console.log('\n' + '='.repeat(60));
  if (backendOk && frontendOk && corsOk && apiOk) {
    console.log('✓ All checks passed! Your app should be working.');
    console.log('\nIf you still see "Failed to fetch":');
    console.log('1. Open browser DevTools (F12) → Console tab');
    console.log('2. Check for specific error messages');
    console.log('3. Go to Network tab and see which request is failing');
    console.log('4. Clear browser cache and localStorage');
    console.log('5. Try in incognito/private mode');
  } else {
    console.log('✗ Some checks failed. Follow the actions above to fix.');
    console.log('\nQuick Fix Steps:');
    if (!backendOk) {
      console.log('1. Start backend: cd backend && venv\\Scripts\\activate && python main.py');
    }
    if (!frontendOk) {
      console.log('2. Start frontend: cd frontend && npm run dev');
    }
    if (!corsOk) {
      console.log('3. Check backend/config/settings.py CORS_ORIGINS includes http://localhost:3000');
    }
  }
  console.log('='.repeat(60));
}

runDiagnostics();
