import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

// For Netlify/Serverless demo, we'll try to use /tmp location if available, otherwise fallback.
// Note: /tmp is ephemeral on Netlify Functions.
const DB_FILE = process.env.NODE_ENV === 'production'
    ? '/tmp/database.json'
    : path.resolve(process.cwd(), 'database.json');

console.log("Using Database File:", DB_FILE);

// Initial Seed Data
// Initial Seed Data
const seedData = {
    candidates: [],
    jobs: [],
    interviews: [],
    applications: [],
    clients: [],
    payments: [],
    users: [],
    client_placements: [],
    email_templates: []
};

class FileDB {
    constructor() {
        this.data = JSON.parse(JSON.stringify(seedData)); // Deep copy seed
        this.load();
    }

    load() {
        try {
            if (fs.existsSync(DB_FILE)) {
                const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
                const loadedData = JSON.parse(fileContent);
                // Merge data to ensure all keys exist
                this.data = { ...this.data, ...loadedData };
            } else {
                this.save();
            }
        } catch (e) {
            console.error("Error loading DB:", e);
        }
    }

    save() {
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
        } catch (e) {
            console.error("Error saving DB:", e);
        }
    }

    // Emulate prepare().run(), get(), all() for compatibility
    prepare(sql) {
        return {
            run: (...args) => this.executeRun(sql, args),
            get: (...args) => this.executeGet(sql, args),
            all: (...args) => this.executeAll(sql, args)
        };
    }

    transaction(fn) {
        // Simple passthrough for transaction
        return (...args) => {
            return fn(args[0]); // assuming arg is iterator
        };
    }

    exec(sql) {
        // No-op for CREATE TABLE, etc.
        return;
    }

    // Helper to parse simple SQL for the demo
    executeAll(sql, args) {
        // Very basic parser for "SELECT * FROM table"
        const lowerSql = sql.toLowerCase();

        // Match SELECT ... FROM table ...
        const match = lowerSql.match(/select\s+(.*?)\s+from\s+([a-z_]+)(?:\s+where\s+(.*?))?(?:\s+order by.*)?$/);

        if (match) {
            const table = match[2];
            const whereClause = match[3];

            if (this.data[table]) {
                let results = [...this.data[table]];

                if (whereClause) {
                    // Crude WHERE filtering
                    // Supports id = ?
                    if (whereClause.includes('client_id = $1') || whereClause.includes('client_id = ?')) {
                        results = results.filter(item => item.client_id === args[0]);
                    }
                    else if (whereClause.includes('candidate_id = ?')) {
                        results = results.filter(item => item.candidate_id === args[0]);
                    }
                    else if (whereClause.includes('job_id = ?')) {
                        results = results.filter(item => item.job_id === args[0]);
                    }
                    else if (whereClause.includes('email = ?')) {
                        results = results.filter(item => item.email === args[0]);
                    }
                    else if (whereClause.includes('role = ?')) {
                        results = results.filter(item => item.role === args[0]);
                    }
                    else if (whereClause.includes('id = ?')) {
                        results = results.filter(item => item.id === args[0]);
                    }
                }

                // Handle count(*)
                if (match[1].includes('count(*)')) {
                    // return [{ count: results.length }];
                    // Better-sqlite3 expects array of objects for .all()
                    // But usually .get() is used for count
                }

                return results;
            }
        }
        return [];
    }

    executeGet(sql, args) {
        if (sql.toLowerCase().includes('count(*)')) {
            const all = this.executeAll(sql, args);
            return { count: all.length };
        }

        // SELECT * FROM table WHERE id = ?
        const lowerSql = sql.toLowerCase();
        const match = lowerSql.match(/from\s+([a-z_]+)/);
        if (match && this.data[match[1]]) {
            const table = this.data[match[1]];
            // Assume first arg is ID if WHERE clause exists
            if (sql.toLowerCase().includes('where id = ?')) {
                return table.find(item => item.id === args[0]);
            }
            if (sql.toLowerCase().includes('where email = ?')) {
                return table.find(item => item.email === args[0]);
            }
        }
        return undefined;
    }

    executeRun(sql, args) {
        // Parsing INSERT and UPDATE
        const lowerSql = sql.trim().toLowerCase();

        if (lowerSql.startsWith('insert into')) {
            const match = lowerSql.match(/insert into\s+([a-z_]+)(?:\s*\((.*?)\))?/);
            if (match && this.data[match[1]]) {
                const table = match[1];
                const columnsStr = match[2];

                let newItem = {};

                // Case 1: args[0] is an object (original support)
                if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
                    newItem = args[0];
                }
                // Case 2: Positional arguments with specified columns
                else if (columnsStr && args.length > 0) {
                    const columns = columnsStr.split(',').map(c => c.trim());
                    // args should match columns length
                    columns.forEach((col, index) => {
                        if (index < args.length) {
                            newItem[col] = args[index];
                        }
                    });
                }
                else {
                    // Fallback or error? For now, empty object
                    console.warn("Could not parse INSERT arguments correctly", sql, args);
                }

                // Handling specific tables if needed
                if (!newItem.id && table !== 'interviews' && table !== 'payments') {
                    newItem.id = randomUUID();
                }
                if (!newItem.created_at) {
                    newItem.created_at = new Date().toISOString();
                }

                this.data[table].push(newItem);
                this.save();
                return { changes: 1, lastInsertRowid: newItem.id };
            }
        } else if (lowerSql.startsWith('update')) {
            const match = lowerSql.match(/update\s+([a-z_]+)/);
            if (match && this.data[match[1]]) {
                const table = this.data[match[1]];
                // WHERE id = ? is usually the last arg
                const id = args[args.length - 1];
                const index = table.findIndex(r => r.id === id);
                if (index !== -1) {
                    // Specific Overrides for simulating success:
                    if (lowerSql.includes('password_hash')) {
                        table[index].password_hash = args[0];
                    }
                    this.save();
                    return { changes: 1 };
                }
            }
        } else if (lowerSql.startsWith('delete from')) {
            const match = lowerSql.match(/delete from\s+([a-z_]+)/);
            if (match && this.data[match[1]]) {
                const table = match[1];
                // Assume WHERE id = ?
                if (lowerSql.includes('where id = ?') && args.length > 0) {
                    const id = args[0];
                    const initialLength = this.data[table].length;
                    this.data[table] = this.data[table].filter(item => item.id !== id);
                    if (this.data[table].length < initialLength) {
                        this.save();
                        return { changes: 1 };
                    }
                }
            }
        }
        return { changes: 0 };
    }
}

// Singleton instance
const db = new FileDB();
export default db;
