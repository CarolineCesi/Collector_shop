import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Keycloak from 'keycloak-js';
import { syncUserAfterLogin, fetchUser, setAuthToken } from '../../api';

interface User {
    id: string;
    name: string;
    email?: string;
    handle: string;
    avatar: string;
    cover: string;
    bio: string;
    joined: string;
    location: string;
    rating: number;
    reviewsCount: number;
    stats: {
        sold: number;
        active: number;
        followers: number;
    };
}

interface UserContextType {
    user: User | null;
    userId: string | null;
    loading: boolean;
    keycloak: Keycloak | null;
    loginAccount: () => void;
    registerAccount: () => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Keycloak instance
const keycloakInstance = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8082',
    realm: 'collector-shop',
    clientId: 'collector-frontend',
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [keycloak, setKeycloak] = useState<Keycloak | null>(null);

    // Initialize Keycloak
    useEffect(() => {
        keycloakInstance.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            checkLoginIframe: false,
        }).then(async (authenticated) => {
            setKeycloak(keycloakInstance);

            if (authenticated && keycloakInstance.token) {
                setAuthToken(keycloakInstance.token);
                const keycloakId = keycloakInstance.subject || '';
                const tokenParsed = keycloakInstance.tokenParsed;
                const name = tokenParsed?.preferred_username || tokenParsed?.name || 'User';
                const email = tokenParsed?.email || '';

                try {
                    // Sync user with our backend
                    const userData = await syncUserAfterLogin(keycloakId, name, email);
                    setUser(userData);
                    setUserId(keycloakId);
                } catch (err) {
                    console.error('Failed to sync user after Keycloak login:', err);
                    // Try fetching user directly
                    try {
                        const userData = await fetchUser(keycloakId);
                        setUser(userData);
                        setUserId(keycloakId);
                    } catch {
                        console.error('User not found in backend');
                    }
                }
            }
            setLoading(false);
        }).catch((err) => {
            console.error('Keycloak init failed:', err);
            setLoading(false);
        });

        // Token refresh
        const refreshInterval = setInterval(() => {
            if (keycloakInstance.authenticated) {
                keycloakInstance.updateToken(30).then((refreshed) => {
                    if (refreshed && keycloakInstance.token) {
                        setAuthToken(keycloakInstance.token);
                    }
                }).catch(() => {
                    console.error('Token refresh failed');
                });
            }
        }, 60000); // Refresh every 60s

        return () => clearInterval(refreshInterval);
    }, []);

    const loginAccount = useCallback(() => {
        keycloakInstance.login({
            redirectUri: window.location.origin + '/profile',
        });
    }, []);

    const registerAccount = useCallback(() => {
        keycloakInstance.register({
            redirectUri: window.location.origin + '/profile',
        });
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setUserId(null);
        setAuthToken(null);
        keycloakInstance.logout({
            redirectUri: window.location.origin,
        });
    }, []);

    return (
        <UserContext.Provider value={{ user, userId, loading, keycloak, loginAccount, registerAccount, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
