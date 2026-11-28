import { Bot, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function FloatingAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  if (location.pathname.startsWith('/assistant') || location.pathname.startsWith('/admin-dashboard')) return null;
  const title = location.pathname.startsWith('/product') ? 'Questions about this product?' : 'Need beauty or shopping help?';
  return <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
    {open && <div className="w-[min(300px,calc(100vw-40px))] rounded-2xl border border-pink-100 bg-white p-4 shadow-[0_15px_45px_rgba(110,20,58,.18)]">
      <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-pink-100 text-pink-600"><Bot className="h-6 w-6" /></div><div><strong className="block text-sm text-slate-900">ShobNow AI</strong><span className="text-xs text-slate-500">AI assistant · not a human</span></div><button onClick={() => setOpen(false)} aria-label="Close assistant prompt" className="ml-auto text-slate-500"><X className="h-4 w-4" /></button></div>
      <p className="mb-3 mt-3 text-sm text-slate-600">{title}</p>
      <Link to="/assistant" state={{ from: location.pathname }} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-600 py-2.5 text-sm font-bold text-white"><Sparkles className="h-4 w-4" /> Chat with the assistant</Link>
    </div>}
    <button onClick={() => setOpen((value) => !value)} aria-label="Open ShobNow AI assistant" className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-pink-600 to-fuchsia-600 text-white shadow-lg shadow-pink-700/25 ring-4 ring-white transition hover:scale-105"><Bot className="h-6 w-6" /></button>
  </div>;
}
