import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { loginAccount } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await loginAccount({ email, password });
            navigate("/"); // Redirect to home on success
        } catch (err: any) {
            setError(err.message || "Failed to login. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cyan-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-cyan-900/40 p-8 rounded-2xl border border-cyan-800/50 shadow-2xl backdrop-blur-sm">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center font-bold text-cyan-950 text-2xl mx-auto mb-4">
                        C
                    </div>
                    <h1 className="text-3xl font-bold text-stone-100 font-serif">Welcome Back</h1>
                    <p className="text-cyan-400/80 mt-2">Sign in to your Collector.shop account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-cyan-950 border border-cyan-800 rounded-lg px-4 py-2.5 text-stone-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-cyan-950 border border-cyan-800 rounded-lg px-4 py-2.5 text-stone-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-amber-400 hover:bg-amber-300 text-cyan-950 font-bold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-stone-400 mt-6 text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium">
                        Sign up now
                    </Link>
                </p>
            </div>
        </div>
    );
}
