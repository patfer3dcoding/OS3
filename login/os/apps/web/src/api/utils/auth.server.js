import { randomUUID } from 'crypto';
import db from '@/api/utils/db.server';

// User roles
export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
};

// Create users table if it doesn't exist
export function initializeAuthDatabase() {
    try {
        db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Check if admin user exists, if not create one
        try {
            db.prepare('ALTER TABLE users ADD COLUMN image TEXT').run();
        } catch (e) {
            // Ignore error if column already exists
        }

        const adminCount = db.prepare('SELECT count(*) as count FROM users WHERE role = ?').get(USER_ROLES.ADMIN).count;
        if (adminCount === 0) {
            // In production, you would hash this password properly
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
            const insertAdmin = db.prepare(`
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES (?, ?, ?, ?, ?)
      `);
            insertAdmin.run(
                randomUUID(),
                'Admin',
                'admin@example.com',
                adminPassword, // In real app, use proper password hashing
                USER_ROLES.ADMIN
            );
        }

        // Check if demo user exists
        const demoCount = db.prepare('SELECT count(*) as count FROM users WHERE email = ?').get('neo@matrix.com').count;
        if (demoCount === 0) {
            const insertDemo = db.prepare(`
        INSERT INTO users (id, name, email, role)
        VALUES (?, ?, ?, ?)
      `);
            insertDemo.run(
                randomUUID(),
                'Neo',
                'neo@matrix.com',
                USER_ROLES.USER
            );
        }
    } catch (error) {
        console.error('Error initializing auth database:', error);
    }
}

/**
 * Authenticate user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, user?: any, token?: string, error?: string}>}
 */
export async function authenticateUser(email, password) {
    initializeAuthDatabase();
    try {
        // In production, use proper password hashing and comparison
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        // For demo purposes, allow password-less login for neo@matrix.com
        // In production, use proper password verification
        if (user.email === 'neo@matrix.com' && !password) {
            const token = generateAuthToken(user);
            return { success: true, user, token };
        }

        // Simple password check for demo (in production, use bcrypt.compare)
        if (user.password_hash !== password) {
            return { success: false, error: 'Invalid password' };
        }

        const token = generateAuthToken(user);
        return { success: true, user, token };
    } catch (error) {
        console.error('Authentication error:', error);
        return { success: false, error: 'Authentication failed' };
    }
}

/**
 * Generate authentication token
 * @param {Object} user
 * @returns {string}
 */
function generateAuthToken(user) {
    // In production, use JWT or proper token generation
    return `token-${user.id}-${Date.now()}-${randomUUID()}`;
}

/**
 * Verify authentication token
 * @param {string} token
 * @returns {Promise<{success: boolean, user?: any, error?: string}>}
 */
export async function verifyAuthToken(token) {
    initializeAuthDatabase();
    try {
        if (!token) {
            return { success: false, error: 'No token provided' };
        }

        // Simple token verification for demo
        // In production, use proper JWT verification
        const userId = token.split('-')[1];
        if (!userId) {
            return { success: false, error: 'Invalid token format' };
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        return { success: true, user };
    } catch (error) {
        console.error('Token verification error:', error);
        return { success: false, error: 'Token verification failed' };
    }
}

/**
 * Check user permissions
 * @param {Object} user
 * @param {string|string[]} requiredRole
 * @returns {boolean}
 */
export function checkPermissions(user, requiredRole) {
    if (!user || !user.role) {
        return false;
    }

    if (Array.isArray(requiredRole)) {
        return requiredRole.includes(user.role);
    }

    return user.role === requiredRole;
}

/**
 * Get user by ID
 * @param {string} userId
 * @returns {Object|null}
 */
export function getUserById(userId) {
    initializeAuthDatabase();
    try {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Object|null}
 */
export function getUserByEmail(email) {
    initializeAuthDatabase();
    try {
        return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    } catch (error) {
        console.error('Error getting user by email:', error);
        return null;
    }
}


