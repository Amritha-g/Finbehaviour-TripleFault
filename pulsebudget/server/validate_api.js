// ═══════════════════════════════════════════
// PULSEBUDGET — API VALIDATION SCRIPT
// ═══════════════════════════════════════════

const BASE_URL = 'http://localhost:5005/api';

async function runTests() {
  console.log('🧪 Starting API Verification tests...');

  try {
    // 1. Test GET /transactions
    console.log('\n--- 1. Testing GET /transactions ---');
    const txRes = await fetch(`${BASE_URL}/transactions`);
    if (!txRes.ok) throw new Error(`GET /transactions failed: ${txRes.statusText}`);
    const txs = await txRes.json();
    console.log(`✅ Retrieved ${txs.length} transactions.`);
    if (txs.length === 0) throw new Error('Expected seeded transactions, but found none.');

    // 2. Test GET /consent
    console.log('\n--- 2. Testing GET /consent ---');
    const consentRes = await fetch(`${BASE_URL}/consent`);
    if (!consentRes.ok) throw new Error(`GET /consent failed: ${consentRes.statusText}`);
    const consent = await consentRes.json();
    console.log('✅ Consent settings:', consent);
    if (consent.Food !== true) throw new Error('Expected Food consent to be default true.');

    // 3. Test GET /preferences
    console.log('\n--- 3. Testing GET /preferences ---');
    const prefRes = await fetch(`${BASE_URL}/preferences`);
    if (!prefRes.ok) throw new Error(`GET /preferences failed: ${prefRes.statusText}`);
    const pref = await prefRes.json();
    console.log('✅ Preferences:', pref);
    if (pref.notifMode !== 'critical') throw new Error('Expected default notifMode to be critical.');

    // 4. Test GET /stats
    console.log('\n--- 4. Testing GET /stats ---');
    const statsRes = await fetch(`${BASE_URL}/stats`);
    if (!statsRes.ok) throw new Error(`GET /stats failed: ${statsRes.statusText}`);
    const stats = await statsRes.json();
    console.log('✅ Computed category stats keys:', Object.keys(stats));
    if (!stats.Food || stats.Food.spent === undefined) throw new Error('Expected Food stats properties.');
    console.log(`✅ Food spent: ₹${stats.Food.spent}, EWMA daily pace: ₹${Math.round(stats.Food.dailyPace)}`);

    // 5. Test POST /transactions (Add transaction)
    console.log('\n--- 5. Testing POST /transactions ---');
    const newTxPayload = {
      merchant: 'Swiggy Test',
      cat: 'Food',
      amt: 500,
      date: '2026-08-08',
      daysAgo: 0
    };
    const addTxRes = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTxPayload)
    });
    if (!addTxRes.ok) throw new Error(`POST /transactions failed: ${addTxRes.statusText}`);
    const addedTx = await addTxRes.json();
    console.log('✅ Added transaction:', addedTx);
    if (addedTx.merchant !== 'Swiggy Test' || addedTx.amt !== 500) throw new Error('Transaction properties mismatch.');

    // 6. Test POST /consent (Update consent)
    console.log('\n--- 6. Testing POST /consent ---');
    const updateConsentPayload = { Food: true, Transport: false, Shopping: true };
    const updateConsentRes = await fetch(`${BASE_URL}/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateConsentPayload)
    });
    if (!updateConsentRes.ok) throw new Error(`POST /consent failed: ${updateConsentRes.statusText}`);
    const updatedConsent = await updateConsentRes.json();
    console.log('✅ Updated consent response:', updatedConsent);
    
    // Verify consent updated in DB
    const verifyConsentRes = await fetch(`${BASE_URL}/consent`);
    const verifiedConsent = await verifyConsentRes.json();
    console.log('✅ Verified updated consent settings:', verifiedConsent);
    if (verifiedConsent.Transport !== false || verifiedConsent.Food !== true) {
      throw new Error('Consent change failed to persist.');
    }

    // 7. Test POST /preferences (Update preferences)
    console.log('\n--- 7. Testing POST /preferences ---');
    const updatePrefPayload = { notifMode: 'ambient' };
    const updatePrefRes = await fetch(`${BASE_URL}/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePrefPayload)
    });
    if (!updatePrefRes.ok) throw new Error(`POST /preferences failed: ${updatePrefRes.statusText}`);
    const updatedPref = await updatePrefRes.json();
    console.log('✅ Updated preference response:', updatedPref);
    
    // Verify preference updated in DB
    const verifyPrefRes = await fetch(`${BASE_URL}/preferences`);
    const verifiedPref = await verifyPrefRes.json();
    console.log('✅ Verified updated preferences:', verifiedPref);
    if (verifiedPref.notifMode !== 'ambient') {
      throw new Error('Preference change failed to persist.');
    }

    // 8. Test POST /transactions/wipe (Reset data)
    console.log('\n--- 8. Testing POST /transactions/wipe ---');
    const wipeRes = await fetch(`${BASE_URL}/transactions/wipe`, { method: 'POST' });
    if (!wipeRes.ok) throw new Error(`POST /transactions/wipe failed: ${wipeRes.statusText}`);
    const wipeResult = await wipeRes.json();
    console.log('✅ Wipe database result:', wipeResult);

    // Verify reset data defaults
    const verifyWipeTxsRes = await fetch(`${BASE_URL}/transactions`);
    const verifyWipeTxs = await verifyWipeTxsRes.json();
    console.log(`✅ Post-wipe transaction count (re-seeded): ${verifyWipeTxs.length}`);
    
    const verifyWipePrefRes = await fetch(`${BASE_URL}/preferences`);
    const verifyWipePref = await verifyWipePrefRes.json();
    console.log('✅ Post-wipe default preference:', verifyWipePref);
    if (verifyWipePref.notifMode !== 'critical') {
      throw new Error('Default notification preferences did not re-seed correctly.');
    }

    console.log('\n🎉 ALL BACKEND API ENDPOINTS VERIFIED SUCCESSFULLY! 🚀');

  } catch (error) {
    console.error('\n❌ API Verification tests failed:', error.message);
    process.exit(1);
  }
}

runTests();
