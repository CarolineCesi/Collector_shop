// api.ts
// Point d'entrée pour toutes les requêtes frontend vers le backend via l'API Gateway

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Token storage for authenticated requests
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

const authHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
};

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

export const syncUserAfterLogin = async (keycloakId: string, name: string, email: string) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ keycloak_id: keycloakId, name, email })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Login sync failed');
    }
    return data;
};

export const fetchUser = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: authHeaders()
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch user ${id}`);
    }
    return response.json();
};

export const fetchUserFavorites = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/favorites`, {
        headers: authHeaders()
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch user favorites for ${id}`);
    }
    return response.json();
};

export const fetchUserListings = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/listings`, {
        headers: authHeaders()
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch user listings for ${id}`);
    }
    return response.json();
};

export const fetchUserProducts = async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/catalogue/products/user/${userId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch products for user ${userId}`);
    }
    return response.json();
};

export const addProduct = async (productData: {
    title: string;
    category: string;
    price: number;
    condition?: string;
    description?: string;
    images?: string[];
    seller?: { name: string; avatar: string; rating: number; reviews: number };
    user_id: string;
}) => {
    const response = await fetch(`${API_BASE_URL}/catalogue/products`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(productData)
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to add product');
    }
    return response.json();
};

export const checkFavorite = async (userId: string, itemId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${itemId}`, {
        headers: authHeaders()
    });
    if (!response.ok) return { isFavorite: false };
    return response.json();
};

export const addFavorite = async (userId: string, itemId: string, itemData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ item_id: itemId, item_data: itemData })
    });
    if (!response.ok) {
        throw new Error('Failed to add favorite');
    }
    return response.json();
};

export const removeFavorite = async (userId: string, itemId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${itemId}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to remove favorite');
    }
    return response.json();
};
