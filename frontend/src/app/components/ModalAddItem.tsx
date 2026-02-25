import { useState } from "react";
import { X, Upload, AlertCircle } from "lucide-react";
import { useI18n } from "../context/I18nContext";

const CATEGORY_KEYS = [
    "sneakers", "toys", "posters", "retroTech",
    "tradingCards", "comics", "watches", "collectorItems",
];

const CONDITIONS = [
    "Mint Condition", "Mint in Box (MIB)", "Excellent",
    "Very Good", "Good", "Fair", "Factory Sealed",
];

interface ModalAddItemProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (item: { title: string; category: string; price: number; condition: string; description: string; imageUrl: string; }) => void;
}

export function ModalAddItem({ open, onClose, onSubmit }: ModalAddItemProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(CATEGORY_KEYS[0]);
    const [price, setPrice] = useState("");
    const [condition, setCondition] = useState(CONDITIONS[0]);
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { t } = useI18n();

    const resetForm = () => { setTitle(""); setCategory(CATEGORY_KEYS[0]); setPrice(""); setCondition(CONDITIONS[0]); setDescription(""); setImageUrl(""); setErrors({}); };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = t('addItem.titleRequired');
        if (!price.trim()) newErrors.price = t('addItem.priceRequired');
        else { const n = parseFloat(price); if (isNaN(n)) newErrors.price = t('addItem.priceInvalid'); else if (n <= 0) newErrors.price = t('addItem.pricePositive'); }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({ title, category, price: parseFloat(price), condition, description, imageUrl });
        resetForm(); onClose();
    };

    const handleClose = () => { resetForm(); onClose(); };
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-cyan-950 border border-cyan-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-cyan-800/50">
                    <h2 className="text-xl font-bold text-stone-100">{t('addItem.title')}</h2>
                    <button onClick={handleClose} className="text-cyan-400 hover:text-stone-100 transition-colors p-1 rounded-lg hover:bg-cyan-800/50"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-cyan-400 mb-1.5">{t('addItem.titleField')} <span className="text-red-400">*</span></label>
                        <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })); }}
                            placeholder="Ex: Nike Air Jordan 1 Original (1985)"
                            className={`w-full bg-cyan-900/40 border rounded-lg px-4 py-2.5 text-stone-100 text-sm placeholder:text-cyan-400/40 focus:outline-none focus:ring-1 transition-all ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-cyan-800 focus:border-amber-400 focus:ring-amber-400'}`} />
                        {errors.title && <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-cyan-400 mb-1.5">{t('addItem.category')}</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-cyan-900/40 border border-cyan-800 rounded-lg px-4 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all">
                                {CATEGORY_KEYS.map(c => <option key={c} value={c} className="bg-cyan-950">{t(`categories.${c}`)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cyan-400 mb-1.5">{t('addItem.condition')}</label>
                            <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full bg-cyan-900/40 border border-cyan-800 rounded-lg px-4 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all">
                                {CONDITIONS.map(c => <option key={c} value={c} className="bg-cyan-950">{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cyan-400 mb-1.5">{t('addItem.price')} <span className="text-red-400">*</span></label>
                        <input type="number" min="0" step="0.01" value={price} onChange={(e) => { setPrice(e.target.value); setErrors(prev => ({ ...prev, price: '' })); }}
                            placeholder="Ex: 1200"
                            className={`w-full bg-cyan-900/40 border rounded-lg px-4 py-2.5 text-stone-100 text-sm placeholder:text-cyan-400/40 focus:outline-none focus:ring-1 transition-all ${errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-cyan-800 focus:border-amber-400 focus:ring-amber-400'}`} />
                        {errors.price && <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {errors.price}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cyan-400 mb-1.5">{t('addItem.description')}</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('addItem.descPlaceholder')} rows={3}
                            className="w-full bg-cyan-900/40 border border-cyan-800 rounded-lg px-4 py-2.5 text-stone-100 text-sm placeholder:text-cyan-400/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cyan-400 mb-1.5">{t('addItem.imageUrl')}</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Upload size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50" />
                                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg"
                                    className="w-full bg-cyan-900/40 border border-cyan-800 rounded-lg pl-9 pr-4 py-2.5 text-stone-100 text-sm placeholder:text-cyan-400/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" />
                            </div>
                        </div>
                    </div>

                    {imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-cyan-800/50 bg-cyan-900/20 h-40 flex items-center justify-center">
                            <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={handleClose} className="flex-1 bg-cyan-900/40 border border-cyan-800 text-stone-300 py-2.5 rounded-xl font-medium hover:bg-cyan-800 transition-colors">{t('addItem.cancel')}</button>
                        <button type="submit" className="flex-1 bg-amber-400 hover:bg-amber-300 text-cyan-950 py-2.5 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-amber-400/20">{t('addItem.submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
