const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');
const { getDB } = require('./db');

const server = new SMTPServer({
    authOptional: true, // Allow no auth for receiving
    onConnect(session, callback) {
        console.log(`SMTP Connect: ${session.remoteAddress}`);
        callback();
    },
    onMailFrom(address, session, callback) {
        console.log(`SMTP MAIL FROM: ${address.address}`);
        callback();
    },
    onRcptTo(address, session, callback) {
        console.log(`SMTP RCPT TO: ${address.address}`);
        // Validate supported domains
        const allowedDomains = ['@catty.my.id', '@cattyprems.top'];
        const isValid = allowedDomains.some(domain => address.address.endsWith(domain));

        if (!isValid) {
            // Ideally we reject, but for testing maybe loose?
            // return callback(new Error('Invalid domain')); 
            console.warn(`Warning: Received email for unknown domain: ${address.address}`);
        }
        callback();
    },
    onData(stream, session, callback) {
        console.log('SMTP Data stream started');
        simpleParser(stream)
            .then(async parsed => {
                const db = getDB();

                const fromAddr = parsed.from ? parsed.from.text : 'unknown';
                // session.envelope.rcptTo is an array of objects {address, args}
                const toAddr = session.envelope.rcptTo.map(t => t.address).join(', ');
                const subject = parsed.subject || '(No Subject)';
                const textBody = parsed.text;
                const htmlBody = parsed.html; // This can be fully safe or sanitized later

                console.log(`Received email from ${fromAddr} to ${toAddr}: ${subject}`);

                await db.run(
                    `INSERT INTO emails (from_address, to_address, subject, text_body, html_body) VALUES (?, ?, ?, ?, ?)`,
                    [fromAddr, toAddr, subject, textBody, htmlBody]
                );

                callback();
            })
            .catch(err => {
                console.error('Error parsing mail:', err);
                callback(new Error('Error parsing mail'));
            });
    }
});

module.exports = server;
