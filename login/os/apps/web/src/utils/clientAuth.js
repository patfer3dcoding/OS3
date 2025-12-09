/**
 * Client-side authentication utility
 * Uses API calls to the server instead of direct database access
 */

// User roles (mirrored from server)
export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
};

/**
 * Authenticate user via API
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, user?: any, token?: string, error?: string}>}
 */
export async function authenticateUser(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Authentication failed' };
        }

        const data = await response.json();
        return {
            success: data.success,
            user: data.user,
            token: data.token,
            error: data.error
        };
    } catch (error) {
        console.error('Authentication API error:', error);
        return { success: false, error: 'Network error during authentication' };
    }
}

/**
 * Verify authentication token via API
 * @param {string} token
 * @returns {Promise<{success: boolean, user?: any, error?: string}>}
 */
export async function verifyAuthToken(token) {
    try {
        const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Token verification failed' };
        }

        const data = await response.json();
        return {
            success: data.success,
            user: data.user,
            error: data.error
        };
    } catch (error) {
        console.error('Token verification API error:', error);
        return { success: false, error: 'Network error during token verification' };
    }
}

/**
 * Check user permissions (client-side)
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
 * Get current user from localStorage
 * @returns {Object|null}
 */
export function getCurrentUser() {
    try {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('authToken');

            if (userData && token) {
                return {
                    user: JSON.parse(userData),
                    token: token
                };
            }
        }
        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Store user authentication data
 * @param {Object} user
 * @param {string} token
 */
export function storeAuthData(user, token) {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('authToken', token);
        }
    } catch (error) {
        console.error('Error storing auth data:', error);
    }
}

/**
 * Clear authentication data
 */
export function clearAuthData() {
    try {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
        }
    } catch (error) {
        console.error('Error clearing auth data:', error);
    }
}

/**
 * Auto-authenticate demo user (for development)
 * @returns {Promise<{success: boolean, user?: any, token?: string, error?: string}>}
 */
export async function autoAuthenticateDemoUser() {
    try {
        // Try to authenticate the demo user
        const result = await authenticateUser('neo@matrix.com', '');

        if (result.success) {
            storeAuthData(result.user, result.token);
            return result;
        }

        // If that fails, try to get existing auth data
        const currentAuth = getCurrentUser();
        if (currentAuth) {
            // Verify the existing token
            const verifyResult = await verifyAuthToken(currentAuth.token);
            if (verifyResult.success) {
                return {
                    success: true,
                    user: verifyResult.user,
                    token: currentAuth.token
                };
            }
        }

        // If all else fails, return the demo user data without authentication
        // This maintains the original demo functionality
        const demoUser = {
            id: 'demo-user',
            name: 'Neo',
            email: 'neo@matrix.com',
            role: 'user'
        };

        const demoToken = `demo-token-${Date.now()}`;

        // Store the demo data
        storeAuthData(demoUser, demoToken);

        return {
            success: true,
            user: demoUser,
            token: demoToken
        };

    } catch (error) {
        console.error('Auto-authentication error:', error);
        return { success: false, error: 'Auto-authentication failed' };
    }
}
