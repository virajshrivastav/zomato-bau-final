/**
 * Test Vercel API Locally
 * ========================
 * This script simulates a call to the Vercel sync-sheets API endpoint
 * to test if it works locally before deploying to Vercel.
 * 
 * Usage:
 *   node scripts/test_vercel_api_locally.js <resId> <drive>
 * 
 * Example:
 *   node scripts/test_vercel_api_locally.js 12345 ncn
 */

import handler from '../api/sync-sheets.js';

// Mock request and response objects
class MockRequest {
  constructor(body) {
    this.method = 'POST';
    this.body = body;
  }
}

class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.body = null;
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  json(data) {
    this.body = data;
    console.log('\n' + '='.repeat(70));
    console.log('RESPONSE STATUS:', this.statusCode);
    console.log('='.repeat(70));
    console.log(JSON.stringify(data, null, 2));
    console.log('='.repeat(70) + '\n');
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node scripts/test_vercel_api_locally.js <resId> <drive>');
  console.error('Example: node scripts/test_vercel_api_locally.js 12345 ncn');
  process.exit(1);
}

const [resId, drive] = args;

// Validate drive type
if (!['ncn', 'n2r', 'items', 'comments'].includes(drive)) {
  console.error('Invalid drive type. Must be: ncn, n2r, items, or comments');
  process.exit(1);
}

console.log('\n' + '='.repeat(70));
console.log('Testing Vercel API Locally');
console.log('='.repeat(70));
console.log('Restaurant ID:', resId);
console.log('Drive:', drive);
console.log('='.repeat(70) + '\n');

// Create mock request and response
const req = new MockRequest({ resId, drive });
const res = new MockResponse();

// Call the handler
handler(req, res)
  .then(() => {
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS: API call completed successfully');
      process.exit(0);
    } else {
      console.log('❌ FAILED: API call returned error status');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n' + '='.repeat(70));
    console.error('❌ UNHANDLED ERROR');
    console.error('='.repeat(70));
    console.error(error);
    console.error('='.repeat(70) + '\n');
    process.exit(1);
  });

