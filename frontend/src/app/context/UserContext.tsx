import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchUser, loginUser, registerUser } from '../../api';

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
    loginAccount: (credentials: any) => Promise<void>;
    registerAccount: (userData: any) => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Start logged out
    const [loading, setLoading] = useState(true);

    // Initial check to see if user was stored in local storage
    useEffect(() => {
        const storedUserId = localStorage.getItem('collector_user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            fetchUser(userId)
                .then(setUser)
                .catch((e) => {
                    console.error(e);
                    logout(); // If the user fails to load, log them out
                })
                .finally(() => setLoading(false));
        } else {
            setUser(null);
            setLoading(false);
            localStorage.removeItem('collector_user_id');
        }
    }, [userId]);

    const loginAccount = async (credentials: any) => {
        const data = await loginUser(credentials);
        setUserId(data.id);
        setUser(data);
        localStorage.setItem('collector_user_id', data.id);
    };

    const registerAccount = async (userData: any) => {
        const data = await registerUser(userData);
        setUserId(data.id);
        setUser(data);
        localStorage.setItem('collector_user_id', data.id);
    };

    const logout = () => {
        setUserId(null);
        setUser(null);
        localStorage.removeItem('collector_user_id');
    };

    return (
        <UserContext.Provider value={{ user, userId, loading, loginAccount, registerAccount, logout }}>
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
