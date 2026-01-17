const imaps = require('imap-simple');

const config = {
    imap: {
        user: 'catsflix@nicola.id',
        password: '@Nandha20',
        host: 'mail.nicola.id',
        port: 993,
        tls: true,
        authTimeout: 10000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

try {
    const connection = await imaps.connect(config);
    console.log('✅ LOGIN SUCCESSFUL!');
    await connection.end();
    return true;
} catch (err) {
    console.log('❌ Login Failed:', err.message);
    if (err.textCode) console.log('   Code:', err.textCode);
    return false;
}
}

async function runTests() {
    // Test 1: Full Email
    const pass1 = await tryConnect('catsflix@nicola.id', '@Nandha20');
    if (pass1) {
        console.log('\n>>> SOLUTION: Use full email address as username.');
        process.exit(0);
    }

    // Test 2: Username only
    const pass2 = await tryConnect('collect', '@Nandha20');
    if (pass2) {
        console.log('\n>>> SOLUTION: Use only "collect" as username (without @domain).');
        process.exit(0);
    }

    console.log('\n>>> CONCLUSION: Both attempts failed. Please verify the password is exactly "@Nandha20".');
}

runTests();
