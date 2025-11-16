/**
 * Test Script for Sync API
 * =========================
 * Tests the /api/sync-sheets endpoint locally
 *
 * Usage:
 *   node scripts/test_sync_api.js
 */

async function testSyncAPI() {
  const testCases = [
    { resId: "19076767", drive: "ncn" },
    { resId: "19076767", drive: "n2r" },
    { resId: "19076767", drive: "items" },
  ];

  console.log("🧪 Testing Sync API...\n");

  for (const testCase of testCases) {
    console.log(`📤 Testing: ${testCase.drive.toUpperCase()} for restaurant ${testCase.resId}`);

    try {
      const response = await fetch("http://localhost:3000/api/sync-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testCase),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ Success:`, result.message);
        console.log(`   Details:`, result.details);
      } else {
        console.log(`❌ Failed:`, result.error);
      }
    } catch (error) {
      console.log(`❌ Error:`, error.message);
    }

    console.log("");
  }

  console.log("🎉 Test complete!");
}

testSyncAPI();
