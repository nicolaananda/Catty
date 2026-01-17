const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const { getDB } = require('./db');

const config = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 993,
        tls: process.env.IMAP_TLS === 'true',
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

async function fetchEmails() {
    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        const delay = 24 * 3600 * 1000;
        let yesterday = new Date();
        yesterday.setTime(Date.now() - delay);
        const since = yesterday.toISOString();

        // Criteria: SINCE yesterday
        // Note: imap-simple search criteria format for date: ['SINCE', dateObject]
        const searchCriteria = [['SINCE', yesterday]];

        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            markSeen: false
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        const db = getDB();

        console.log(`IMAP: Found ${messages.length} messages since last 24h`);

        for (const item of messages) {
            // Get full body
            const fullBody = item.parts.find(p => p.which === '').body;
            const parsed = await simpleParser(fullBody);

            const messageId = parsed.messageId || `no-id-${Date.now()}-${Math.random()}`; // Fallback if missing
            const fromAddr = parsed.from ? parsed.from.text : 'unknown';
            const subject = parsed.subject || '(No Subject)';
            const textBody = parsed.text;
            const htmlBody = parsed.html;

            // Extract Destination Address
            let toAddr = '';
            if (parsed.to && Array.isArray(parsed.to.value)) {
                toAddr = parsed.to.value.map(t => t.address).join(', ');
            } else if (parsed.to && parsed.to.text) {
                toAddr = parsed.to.text;
            }

            // Deduplication Check
            try {
                await db.run(
                    `INSERT INTO emails (message_id, from_address, to_address, subject, text_body, html_body, received_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [messageId, fromAddr, toAddr, subject, textBody, htmlBody, parsed.date || new Date()]
                );
                console.log(`IMAP Saved: ${subject} (${messageId})`);
            } catch (e) {
                if (e.code === 'SQLITE_CONSTRAINT') {
                    // console.log(`IMAP: Duplicate skipped (${messageId})`);
                } else {
                    console.error('IMAP Insert Error:', e);
                }
            }
        }

        connection.end();
    } catch (err) {
        console.error('IMAP Fetch Error:', err);
    }
}

// Polling Loop
function startImapPolling(intervalMs = 10000) {
    console.log('Starting IMAP polling service...');
    fetchEmails(); // Initial fetch
    setInterval(fetchEmails, intervalMs);
}

module.exports = { startImapPolling };
