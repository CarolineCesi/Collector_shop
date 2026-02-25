import { useUser } from "../context/UserContext";
import { useI18n } from "../context/I18nContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { LogIn } from "lucide-react";

export function Login() {
    const { user, loginAccount } = useUser();
    const { t } = useI18n();
    const navigate = useNavigate();

    useEffect(() => { if (user) navigate("/profile"); }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-cyan-950">
            <div className="w-full max-w-md space-y-8 text-center">
                <div>
                    <div className="w-16 h-16 rounded-xl bg-amber-400 flex items-center justify-center font-bold text-cyan-950 text-3xl mx-auto mb-6">C</div>
                    <h1 className="text-3xl font-bold text-stone-100 mb-2">{t('auth.welcome')}</h1>
                    <p className="text-cyan-400">{t('auth.loginDesc')}</p>
                </div>
                <button onClick={loginAccount} className="w-full bg-amber-400 hover:bg-amber-300 text-cyan-950 py-4 px-8 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-amber-400/20 flex items-center justify-center gap-3">
                    <LogIn size={22} /> {t('auth.loginButton')}
                </button>
                <p className="text-stone-400 text-sm">
                    {t('auth.noAccount')}{" "}
                    <button onClick={loginAccount} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">{t('auth.createAccount')}</button>
                </p>
            </div>
        </div>
    );
}
