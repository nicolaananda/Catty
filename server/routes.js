const express = require('express');
const { getDB } = require('./db');
const router = express.Router();

// Strict Service IDs map
const SERVICE_ZOOM = 1;
const SERVICE_NETFLIX = 2;
const SERVICE_OTHER = 3;

// Helper: Build Strict Criteria (Subject OR Sender)
const buildCriteria = (serviceFilter) => {
    let clauses = [];
    let localParams = [];

    // 1. Match by Subject (Strict Whitelist)
    if (serviceFilter.subject_filter) {
        const subjects = serviceFilter.subject_filter.split('|').map(s => s.trim()).filter(Boolean);
        subjects.forEach(sub => {
            clauses.push(`subject LIKE ?`);
            localParams.push(`%${sub}%`);
        });
    }

    // 2. Match by Sender Domain (Strict Whitelist)
    if (serviceFilter.sender_filter) {
        clauses.push(`from_address LIKE ?`);
        localParams.push(`%${serviceFilter.sender_filter}%`);
    }

    return { clause: clauses.join(' OR '), params: localParams };
};

// 1. Get Emails for specific User & Service
router.get('/emails/:user/service/:serviceId', async (req, res) => {
    const db = getDB();
    const { user, serviceId } = req.params;
    // Support legacy @catsflix.site and new domains if needed, but primarily we filter by the user part.
    // Actually, `to_address` column stores the full address.
    // If we want to find emails for "user", we should search `user@catty.my.id` OR `user@cattyprems.top`.
    // The previous logic was: const targetAddress = `${user}@catsflix.site`;
    // We will now search for the username part in the to_address.

    // Base Logic: (Recipient Match) + Exclude system emails
    // We'll trust the partial match OR specific domain match.
    // Let's broaden the search to any domain for this user for now, or specific ones.
    const targetSystemEmail = 'tampung@catty.my.id';

    // Fetch filters dynamically
    const services = await db.all('SELECT * FROM services');
    const zoomService = services.find(s => s.name === 'Zoom') || { sender_filter: 'zoom.us', subject_filter: 'Zoom' };
    const netflixService = services.find(s => s.name === 'Netflix') || { sender_filter: 'netflix.com', subject_filter: 'Netflix' };

    // Base Logic: (Recipient Match) + Exclude system emails
    let sql = `SELECT * FROM emails WHERE (to_address LIKE ? OR to_address LIKE ? OR to_address = '' OR to_address IS NULL) AND from_address NOT LIKE ?`;
    const params = [`${user}@catty.my.id`, `${user}@cattyprems.top`, `%${targetSystemEmail}%`];

    const sId = parseInt(serviceId);

    if (sId === SERVICE_ZOOM) {
        // STRICT ZOOM
        const c = buildCriteria(zoomService);
        if (c.clause) {
            sql += ` AND (${c.clause})`;
            params.push(...c.params);
        }
    } else if (sId === SERVICE_NETFLIX) {
        // STRICT NETFLIX
        const c = buildCriteria(netflixService);
        if (c.clause) {
            sql += ` AND (${c.clause})`;
            params.push(...c.params);
        }
    } else if (sId === SERVICE_OTHER) {
        // ... (unchanged)
        // "General" = EXCLUDE ALL emails from Zoom/Netflix domains (by sender)
        // This prevents ANY Zoom/Netflix email (even non-whitelisted ones) from appearing in General

        // Exclude by sender domain (not subject)
        if (zoomService.sender_filter) {
            sql += ` AND from_address NOT LIKE ?`;
            params.push(`%${zoomService.sender_filter}%`);
        }

        if (netflixService.sender_filter) {
            sql += ` AND from_address NOT LIKE ?`;
            params.push(`%${netflixService.sender_filter}%`);
        }
    }

    sql += ` ORDER BY received_at DESC`;

    try {
        const emails = await db.all(sql, params);
        res.json(emails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 2. All Inbox Route (excludes Zoom & Netflix by subject)
router.get('/emails/:user', async (req, res) => {
    const db = getDB();
    const { user } = req.params;
    const targetSystemEmail = 'tampung@catty.my.id';

    try {
        // Fetch service filters to exclude them from "All Inbox"
        const services = await db.all('SELECT * FROM services');
        const zoomService = services.find(s => s.name === 'Zoom') || { sender_filter: 'zoom.us', subject_filter: 'Zoom' };
        const netflixService = services.find(s => s.name === 'Netflix') || { sender_filter: 'netflix.com', subject_filter: 'Netflix' };

        let sql = `SELECT * FROM emails WHERE (to_address LIKE ? OR to_address LIKE ? OR to_address = '' OR to_address IS NULL) AND from_address NOT LIKE ?`;
        const params = [`${user}@catty.my.id`, `${user}@cattyprems.top`, `%${targetSystemEmail}%`];

        // Exclude by sender domain (not subject) - REMOVED to show ALL emails
        // if (zoomService.sender_filter) { ... }

        /* 
        if (zoomService.sender_filter) {
            sql += ` AND from_address NOT LIKE ?`;
            params.push(`%${zoomService.sender_filter}%`);
        }

        if (netflixService.sender_filter) {
            sql += ` AND from_address NOT LIKE ?`;
            params.push(`%${netflixService.sender_filter}%`);
        } 
        */

        sql += ` ORDER BY received_at DESC`;

        const emails = await db.all(sql, params);
        res.json(emails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. List Services
router.get('/services', async (req, res) => {
    try {
        const db = getDB();
        const services = await db.all(`SELECT * FROM services`);
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: 'Internal Error' });
    }
});

// 4. Create New Service (Admin)
router.post('/admin/services', async (req, res) => {
    try {
        const db = getDB();
        const { name, sender_filter, subject_filter } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Service name is required' });
        }

        const result = await db.run(
            `INSERT INTO services (name, sender_filter, subject_filter) VALUES (?, ?, ?)`,
            [name, sender_filter || '', subject_filter || '']
        );

        res.json({
            success: true,
            id: result.lastID,
            message: 'Service created successfully'
        });
    } catch (err) {
        console.error('Error creating service:', err);
        res.status(500).json({ error: 'Failed to create service' });
    }
});

// 5. Update Service Filters (Admin)
router.put('/admin/services/:id', async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const { subject_filter, sender_filter } = req.body;

        await db.run(
            `UPDATE services SET subject_filter = ?, sender_filter = ? WHERE id = ?`,
            [subject_filter, sender_filter, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Internal Error' });
    }
});

module.exports = router;
