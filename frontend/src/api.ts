// api.ts
// Point d'entrée pour toutes les requêtes frontend vers le backend via l'API Gateway

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const fetchTrendingProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/catalogue/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch trending products');
    }
    return response.json();
};

export const fetchProductById = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/catalogue/products/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch product ${id}`);
    }
    return response.json();
};

export const fetchExclusiveProduct = async () => {
    const response = await fetch(`${API_BASE_URL}/catalogue/products/exclusive`);
    if (!response.ok) {
        throw new Error('Failed to fetch exclusive product');
    }
    return response.json();
};

export const registerUser = async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
    }
    return data;
};

export const loginUser = async (credentials: any) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }
    return data;
};

export const fetchUser = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch user ${id}`);
    }
    return response.json();
};

export const fetchUserFavorites = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/favorites`);
    if (!response.ok) {
        throw new Error(`Failed to fetch user favorites for ${id}`);
    }
    return response.json();
};

export const fetchUserListings = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/listings`);
    if (!response.ok) {
        throw new Error(`Failed to fetch user listings for ${id}`);
    }
    return response.json();
};

export const fetchMessages = async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/messages/${userId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch messages for user ${userId}`);
    }
    return response.json();
};

export const sendMessage = async (conversationId: string, senderId: string, text: string) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, senderId, text })
    });
    if (!response.ok) {
        throw new Error('Failed to send message');
    }
    return response.json();
};
