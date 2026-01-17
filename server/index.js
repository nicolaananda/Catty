require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
// const smtpServer = require('./smtp'); // Deprecated for IMAP
const { startImapListener } = require('./imap');
const apiRoutes = require('./routes');

const app = express();
const API_PORT = process.env.PORT || 3001;
// const SMTP_PORT = 2525;

app.use(cors());
app.use(express.json());

// Init DB
initDB().then(() => {

    // API Routes
    app.use('/api', apiRoutes);

    app.get('/', (req, res) => {
        res.send('ReceiveMail Backend Running (IMAP Mode)');
    });

    // Start Express
    app.listen(API_PORT, () => {
        console.log(`HTTP API running on port ${API_PORT}`);
    });

    // Start IMAP Listener (IDLE)
    startImapListener();

    // Auto-Delete Old Emails (Retention Policy: 24 Hours)
    // Runs every hour
    const { getDB } = require('./db');
    setInterval(async () => {
        try {
            const db = getDB();
            const result = await db.run("DELETE FROM emails WHERE received_at < datetime('now', '-1 day')");
            if (result.changes > 0) {
                console.log(`[Cleanup] Deleted ${result.changes} emails older than 24 hours.`);
            }
        } catch (err) {
            console.error('[Cleanup] Error deleting old emails:', err);
        }
    }, 60 * 60 * 1000); // 1 hour

    // Run cleanup immediately on startup
    setTimeout(async () => {
        try {
            const db = getDB();
            const result = await db.run("DELETE FROM emails WHERE received_at < datetime('now', '-1 day')");
            console.log(`[Startup Cleanup] Deleted ${result.changes} emails older than 24 hours.`);
        } catch (err) {
            console.error('[Startup Cleanup] Error:', err);
        }
    }, 5000);



}).catch(err => {
    console.error('Failed to initialize database:', err);
});
