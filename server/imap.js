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



// Reusable function to fetch and save new messages
async function fetchNewMessages(connection) {
    try {
        const delay = 7 * 24 * 3600 * 1000; // 7 days
        let sevenDaysAgo = new Date();
        sevenDaysAgo.setTime(Date.now() - delay);

        // Search for messages from the last 7 days (matching retention policy)
        // This ensures we fetch all emails that haven't been cleaned up yet
        const searchCriteria = [['SINCE', sevenDaysAgo]];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            markSeen: false
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        const db = getDB();

        if (messages.length > 0) {
            console.log(`IMAP: Processing ${messages.length} messages...`);
        }

        for (const item of messages) {
            // Get full body
            const fullBody = item.parts.find(p => p.which === '').body;
            const parsed = await simpleParser(fullBody);

            const messageId = parsed.messageId || `no-id-${Date.now()}-${Math.random()}`;
            const fromAddr = parsed.from ? parsed.from.text : 'unknown';
            const subject = parsed.subject || '(No Subject)';
            const textBody = parsed.text;
            const htmlBody = parsed.html;

            // Extract Destination Address
            // Priority: X-Original-To > Delivered-To > X-Forwarded-To > To header
            let toAddr = '';

            // Check forwarding headers first (for emails forwarded from @catty.my.id to catsflix@nicola.id)
            const headers = parsed.headers;
            if (headers) {
                const originalTo = headers.get('x-original-to') ||
                    headers.get('delivered-to') ||
                    headers.get('x-forwarded-to');

                if (originalTo) {
                    // Extract email address from header value
                    const match = originalTo.toString().match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
                    if (match && (match[1].includes('@catty.my.id') || match[1].includes('@cattyprems.top'))) {
                        toAddr = match[1];
                        console.log(`IMAP: Found original recipient in headers: ${toAddr}`);
                    }
                }
            }

            // Fallback to standard To header if no forwarding header found
            if (!toAddr) {
                if (parsed.to && Array.isArray(parsed.to.value)) {
                    toAddr = parsed.to.value.map(t => t.address).join(', ');
                } else if (parsed.to && parsed.to.text) {
                    toAddr = parsed.to.text;
                }
            }

            // Deduplication Check
            try {
                await db.run(
                    `INSERT INTO emails (message_id, from_address, to_address, subject, text_body, html_body, received_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [messageId, fromAddr, toAddr, subject, textBody, htmlBody, parsed.date || new Date()]
                );
                console.log(`IMAP Saved: ${subject} (${messageId})`);
            } catch (e) {
                if (e.code !== 'SQLITE_CONSTRAINT') {
                    console.error('IMAP Insert Error:', e);
                }
            }
        }
    } catch (err) {
        console.error('Error fetching messages:', err);
    }
}

let connection = null;

async function startImapListener() {
    try {
        console.log('IMAP: Connecting to server...');
        connection = await imaps.connect(config);

        await connection.openBox('INBOX');
        console.log('IMAP: Connected & Listening for new emails (IDLE)...');

        // Initial Fetch
        await fetchNewMessages(connection);

        // Event: New Mail Arrived
        connection.imap.on('mail', async (numNew) => {
            console.log(`IMAP Event: ${numNew} new message(s) arrived!`);
            await fetchNewMessages(connection);
        });

        // Event: Connection Closed/Error -> Reconnect
        connection.imap.on('close', () => {
            console.log('IMAP: Connection closed. Reconnecting in 5s...');
            setTimeout(startImapListener, 5000);
        });

        connection.imap.on('error', (err) => {
            console.error('IMAP Usage Error:', err);
            // 'close' event usually follows error, handling reconnect there
        });

    } catch (err) {
        console.error('IMAP Connection Failed:', err);
        console.log('IMAP: Retrying in 10s...');
        setTimeout(startImapListener, 10000);
    }
}

module.exports = { startImapListener };
