const http = require('http');

async function makeRequest(path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(data)
          });
        } catch {
          resolve({
            statusCode: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', (e) => { reject(e); });
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function run() {
  console.log('--- START SESSION TEST ---');
  
  // Register or Login User A
  const emailA = `usera-${Date.now()}@test.com`;
  const registerA = await makeRequest('/api/auth/register', 'POST', {}, {
    email: emailA,
    name: 'User A',
    password: 'password123'
  });
  
  if (registerA.statusCode !== 201) {
    console.error('Failed to register User A:', registerA);
    return;
  }
  const tokenA = registerA.body.data.accessToken;
  const idA = registerA.body.data.user.id;
  console.log(`Registered User A. ID: ${idA}`);

  // Register or Login User B
  const emailB = `userb-${Date.now()}@test.com`;
  const registerB = await makeRequest('/api/auth/register', 'POST', {}, {
    email: emailB,
    name: 'User B',
    password: 'password123'
  });

  if (registerB.statusCode !== 201) {
    console.error('Failed to register User B:', registerB);
    return;
  }
  const tokenB = registerB.body.data.accessToken;
  const idB = registerB.body.data.user.id;
  console.log(`Registered User B. ID: ${idB}`);

  // Now, fire concurrent sync requests
  console.log('Sending concurrent requests...');
  
  // Sync some data for A and B first so we have different values in DB
  await makeRequest('/api/auth/sync', 'POST', { 'Authorization': `Bearer ${tokenA}` }, {
    activeDraft: JSON.stringify({ title: 'User A Portfolio' })
  });
  await makeRequest('/api/auth/sync', 'POST', { 'Authorization': `Bearer ${tokenB}` }, {
    activeDraft: JSON.stringify({ title: 'User B Portfolio' })
  });

  // Make concurrent requests:
  // We will perform a GET to /api/auth/sync for User A and User B concurrently and verify the output.
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(makeRequest('/api/auth/sync', 'GET', { 'Authorization': `Bearer ${tokenA}` }).then(res => ({ user: 'A', res })));
    promises.push(makeRequest('/api/auth/sync', 'GET', { 'Authorization': `Bearer ${tokenB}` }).then(res => ({ user: 'B', res })));
  }

  const results = await Promise.all(promises);
  let errors = 0;
  for (const item of results) {
    const activeDraft = item.res.body.data.activeDraft;
    const title = activeDraft ? JSON.parse(activeDraft).title : null;
    if (item.user === 'A' && title !== 'User A Portfolio') {
      console.error(`ERROR: User A request returned: ${title}`);
      errors++;
    } else if (item.user === 'B' && title !== 'User B Portfolio') {
      console.error(`ERROR: User B request returned: ${title}`);
      errors++;
    }
  }

  if (errors === 0) {
    console.log('SUCCESS: No concurrent session leakage detected on backend!');
  } else {
    console.log(`FAILURE: Detected ${errors} session leakage errors!`);
  }
}

run().catch(console.error);
