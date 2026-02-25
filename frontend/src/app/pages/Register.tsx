import { useUser } from "../context/UserContext";
import { useI18n } from "../context/I18nContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { UserPlus } from "lucide-react";

export function Register() {
    const { user, registerAccount } = useUser();
    const { t } = useI18n();
    const navigate = useNavigate();

    useEffect(() => { if (user) navigate("/profile"); }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-cyan-950">
            <div className="w-full max-w-md space-y-8 text-center">
                <div>
                    <div className="w-16 h-16 rounded-xl bg-amber-400 flex items-center justify-center font-bold text-cyan-950 text-3xl mx-auto mb-6">C</div>
                    <h1 className="text-3xl font-bold text-stone-100 mb-2">{t('auth.joinTitle')}</h1>
                    <p className="text-cyan-400">{t('auth.joinDesc')}</p>
                </div>
                <button onClick={registerAccount} className="w-full bg-amber-400 hover:bg-amber-300 text-cyan-950 py-4 px-8 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-amber-400/20 flex items-center justify-center gap-3">
                    <UserPlus size={22} /> {t('auth.registerButton')}
                </button>
                <p className="text-stone-400 text-sm">
                    {t('auth.haveAccount')}{" "}
                    <button onClick={() => navigate("/login")} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">{t('auth.signIn')}</button>
                </p>
            </div>
        </div>
    );
}
