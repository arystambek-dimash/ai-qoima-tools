const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface User {
    id: string;
    email: string;
    name: string | null;
    company: {
        id: string;
        name: string;
    } | null;
}

export interface ValidateEmailResponse {
    allowed: boolean;
    message?: string;
    company?: {
        id: string;
        name: string;
    };
}

export interface LoginResponse {
    success: boolean;
    user?: User;
    token?: string;
    error?: {
        code: string;
        message: string;
    };
}

// Storage keys
const USER_TOKEN_KEY = 'user_token';
const USER_DATA_KEY = 'user_data';

// Get stored token
export function getUserToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(USER_TOKEN_KEY);
    }
    return null;
}

// Get stored user data
export function getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(USER_DATA_KEY);
        if (data) {
            try {
                return JSON.parse(data);
            } catch {
                return null;
            }
        }
    }
    return null;
}

// Store user data
export function storeUserSession(token: string, user: User) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_TOKEN_KEY, token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    }
}

// Clear user session
export function clearUserSession() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
    }
}

// Validate email domain
export async function validateEmail(email: string): Promise<ValidateEmailResponse> {
    const res = await fetch(`${API_BASE}/auth/validate-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    return await res.json();
}

// Login with email
export async function loginWithEmail(email: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success && data.token && data.user) {
        storeUserSession(data.token, data.user);
    }

    return data;
}

// Verify current session
export async function verifySession(): Promise<User | null> {
    const token = getUserToken();
    if (!token) {
        return null;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            clearUserSession();
            return null;
        }

        const data = await res.json();
        if (data.user) {
            // Update stored user data
            storeUserSession(token, data.user);
            return data.user;
        }

        clearUserSession();
        return null;
    } catch {
        clearUserSession();
        return null;
    }
}

// Logout
export function logout() {
    clearUserSession();
}

// Check if user is logged in (synchronous check)
export function isLoggedIn(): boolean {
    return !!getUserToken();
}
