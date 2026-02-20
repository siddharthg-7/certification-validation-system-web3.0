const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../database.sqlite');
let db = null;

/**
 * Initialize SQLite database
 */
async function initDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DB_PATH, async (err) => {
            if (err) {
                console.error('Database connection failed:', err);
                reject(err);
            } else {
                console.log('📊 Connected to SQLite database');
                try {
                    await createTables();
                    await runMigrations();
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }
        });
    });
}

/**
 * Create database tables
 */
function createTables() {
    return new Promise((resolve, reject) => {
        const createTableSQL = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        txHash TEXT NOT NULL UNIQUE,
        docHash TEXT NOT NULL,
        contentHash TEXT, 
        imageHash TEXT,
        ipfsCID TEXT NOT NULL,
        issuer TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        blockNumber INTEGER,
        gasUsed TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

        db.run(createTableSQL, (err) => {
            if (err) {
                console.error('Table creation failed:', err);
                reject(err);
            } else {
                console.log('✅ Database tables ready');
                resolve();
            }
        });
    });
}

/**
 * Run migrations to add new columns if they don't exist
 */
function runMigrations() {
    return new Promise((resolve, reject) => {
        const migrations = [
            "ALTER TABLE transactions ADD COLUMN contentHash TEXT",
            "ALTER TABLE transactions ADD COLUMN imageHash TEXT"
        ];

        let completed = 0;

        // Helper to run a single migration safely (ignoring duplicate column errors)
        const runMigration = (sql) => {
            return new Promise((res) => {
                db.run(sql, (err) => {
                    // Ignore error if column already exists
                    if (err && !err.message.includes('duplicate column name')) {
                        console.warn(`Migration warning: ${err.message}`);
                    }
                    res();
                });
            });
        };

        (async () => {
            for (const sql of migrations) {
                await runMigration(sql);
            }
            resolve();
        })();
    });
}

function insertTransaction(transaction) {
    return new Promise((resolve, reject) => {
        const sql = `
      INSERT INTO transactions (txHash, docHash, contentHash, imageHash, ipfsCID, issuer, timestamp, status, blockNumber, gasUsed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const params = [
            transaction.txHash,
            transaction.docHash,
            transaction.contentHash || null,
            transaction.imageHash || null,
            transaction.ipfsCID,
            transaction.issuer,
            transaction.timestamp,
            transaction.status || 'confirmed',
            transaction.blockNumber,
            transaction.gasUsed
        ];

        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

function getTransactionByHash(txHash) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM transactions WHERE txHash = ?';
        db.get(sql, [txHash], (err, row) => {
            if (err) reject(err);
            else resolve(row || null);
        });
    });
}

function getTransactionByDocHash(docHash) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM transactions WHERE docHash = ?';
        db.get(sql, [docHash], (err, row) => {
            if (err) reject(err);
            else resolve(row || null);
        });
    });
}

function getAllTransactions(limit = 50, offset = 0) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM transactions ORDER BY createdAt DESC LIMIT ? OFFSET ?';
        db.all(sql, [limit, offset], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

/**
 * Get all image hashes for similarity search
 */
function getAllImageHashes() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT imageHash, docHash, txHash FROM transactions WHERE imageHash IS NOT NULL';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function getTransactionsByIssuer(issuer) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM transactions WHERE issuer = ? ORDER BY createdAt DESC';
        db.all(sql, [issuer], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function updateTransactionStatus(txHash, status) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE transactions SET status = ? WHERE txHash = ?';
        db.run(sql, [status, txHash], function (err) {
            if (err) reject(err);
            else resolve(this.changes > 0);
        });
    });
}

function getStats() {
    return new Promise((resolve, reject) => {
        const sql = `
      SELECT 
        COUNT(*) as totalTransactions,
        COUNT(DISTINCT issuer) as totalIssuers,
        COUNT(DISTINCT docHash) as totalCertificates
      FROM transactions
    `;
        db.get(sql, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function closeDatabase() {
    return new Promise((resolve, reject) => {
        if (db) {
            db.close((err) => {
                if (err) reject(err);
                else {
                    console.log('Database connection closed');
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
}

module.exports = {
    initDatabase,
    insertTransaction,
    getTransactionByHash,
    getTransactionByDocHash,
    getAllTransactions,
    getTransactionsByIssuer,
    updateTransactionStatus,
    getAllImageHashes,
    getStats,
    closeDatabase
};
