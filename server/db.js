const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let db;

async function initDB() {
  // Ensure data directory exists (for Docker volume)
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = await open({
    filename: path.join(dataDir, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id TEXT UNIQUE,
      from_address TEXT,
      to_address TEXT,
      subject TEXT,
      text_body TEXT,
      html_body TEXT,
      received_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      sender_filter TEXT,
      subject_filter TEXT,
      domain_filter TEXT
    );
    
    -- Insert default services if empty
    INSERT OR IGNORE INTO services (id, name, sender_filter, subject_filter) 
    VALUES (1, 'Zoom', 'zoom.us', 'Kode untuk masuk ke Zoom|Undangan akun Zoom|Zoom account invitation|Code for signing in to Zoom');
    
    INSERT OR IGNORE INTO services (id, name, sender_filter, subject_filter) 
    VALUES (2, 'Netflix', 'netflix.com', 'Netflix: Your sign-in code|Your Netflix temporary access code|Netflix: Kode masukmu|Kode akses sementara Netflix-mu');
  `);

  console.log('Database initialized');
  return db;
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

module.exports = { initDB, getDB };
