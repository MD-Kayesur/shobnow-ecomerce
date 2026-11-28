import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Bot, Check, CheckCheck, CircleHelp, Clock3,
  Image as ImageIcon, Info, LockKeyhole, Menu, Mic, MoreHorizontal, Volume2,
  Plus, Search, Send, ShieldCheck, ShoppingBag, Sparkles, X,
} from 'lucide-react';
import Logo from '@/assets/Logo/shobnow-logo.png';
import proofImageOne from '@/assets/products/prod-bien-pink.jpg';
import proofImageTwo from '@/assets/products/prod-peach-colvea.jpg';
import proofImageThree from '@/assets/products/prod-red-jars.jpg';
import aiAssistantAvatar from '@/assets/assistant-ai-avatar.svg';
import './Assistant.css';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/redux-hook';
import { addToCart } from '@/redux/features/cart/cartSlice';
import { useGetStoreProductQuery, type StoreProduct } from '@/redux/features/storefront/storefrontApi';
import {
  useDeleteAssistantSessionMutation, useGetAssistantSessionQuery,
  useGetAssistantSessionsQuery, useSendAssistantMessageMutation,
  type AssistantTurn,
} from '@/redux/features/assistant/assistantApi';

type ChatMessage = AssistantTurn & {
  id: string;
  time: string;
  products?: string[];
};
const nowLabel = () => new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date());
const welcome: ChatMessage = {
  id: 'welcome', role: 'assistant', time: nowLabel(),
  text: 'Hi! 👋 I’m your ShobNow AI beauty assistant. Tell me about your skin or what you’re looking for, and I’ll help you explore our catalog.',
};
const money = (value: number | string) => `৳${Number(value || 0).toLocaleString('en-BD')}`;

function ProductRecommendation({ id, onAdd }: { id: string; onAdd: (product: StoreProduct) => void }) {
  const { data, isLoading } = useGetStoreProductQuery(id);
  const product = data?.data;
  if (isLoading) return <div className="my-2 h-24 animate-pulse rounded-2xl bg-pink-50" />;
  if (!product) return null;
  const image = product.media?.find((media) => media.isPrimary)?.imageUrl || product.media?.[0]?.imageUrl;
  const price = Number(product.salePrice || product.price);
  return <div className="mt-3 flex max-w-[440px] items-center gap-3 rounded-2xl border border-pink-100 bg-white p-3 shadow-sm">
    <Link to={`/products/${product.slug}`} className="h-[90px] w-[90px] shrink-0 overflow-hidden rounded-xl bg-pink-50">
      {image ? <img src={image} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-pink-400"><ShoppingBag /></div>}
    </Link>
    <div className="min-w-0 flex-1">
      <Link to={`/products/${product.slug}`} className="line-clamp-2 font-bold text-slate-900 hover:text-pink-600">{product.name}</Link>
      <p className="mt-1 text-sm text-slate-500">{product.brand?.name || 'ShobNow catalog'}</p>
      <p className="mt-1 font-extrabold text-slate-900">{money(price)} {product.stock <= 0 && <span className="font-normal text-slate-400">· Out of stock</span>}</p>
    </div>
    <button onClick={() => onAdd(product)} disabled={product.stock <= 0} className="shrink-0 rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-40">Add <ArrowRight className="ml-1 inline h-4 w-4" /></button>
  </div>;
}

function MessageBubble({ message, onAdd }: { message: ChatMessage; onAdd: (product: StoreProduct) => void }) {
  const user = message.role === 'user';
  return <div className={`flex items-end gap-3 ${user ? 'justify-end' : 'justify-start'}`}>
    {!user && <div className="mb-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pink-100 text-pink-600"><Bot className="h-5 w-5" /></div>}
    <div className={`max-w-[80%] ${user ? 'items-end' : 'items-start'}`}>
      <div className={`whitespace-pre-wrap rounded-[22px] px-4 py-3 text-[15px] leading-6 shadow-sm ${user ? 'rounded-br-md bg-gradient-to-br from-pink-600 to-fuchsia-600 text-white' : 'rounded-bl-md border border-pink-100 bg-gradient-to-br from-white to-pink-50/80 text-slate-900'}`}>{message.text}
        <div className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${user ? 'text-pink-100' : 'text-slate-500'}`}>{message.time}{user && <CheckCheck className="h-3.5 w-3.5" />}</div>
      </div>
      {!user && message.products?.map((productId) => <ProductRecommendation key={productId} id={productId} onAdd={onAdd} />)}
    </div>
  </div>;
}

const proofRows = [
  { icon: ShieldCheck, title: 'AI identity', detail: 'Clearly disclosed', status: 'Active' },
  { icon: ShoppingBag, title: 'Product catalog', detail: 'ShobNow store records', status: 'Connected' },
  { icon: LockKeyhole, title: 'Chat privacy', detail: 'Account or temporary guest chat', status: 'Protected' },
];

const Assistant = () => {
  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(auth.token && auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState<string>();
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Beauty' | 'Orders' | 'Support'>('Beauty');
  const [showDetails, setShowDetails] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [notice, setNotice] = useState('');
  const [sendMessage, sendState] = useSendAssistantMessageMutation();
  const [deleteSession] = useDeleteAssistantSessionMutation();
  const { data: sessionsData, isLoading: sessionsLoading } = useGetAssistantSessionsQuery(undefined, { skip: !isAuthenticated });
  const { data: selectedData } = useGetAssistantSessionQuery(selectedId || '', { skip: !isAuthenticated || !selectedId });
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const locationContext = location.state as { from?: string; productName?: string; initialPrompt?: string } | null;
  const productContext = locationContext?.productName;

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, sendState.isLoading]);
  useEffect(() => { if (locationContext?.initialPrompt) setDraft(locationContext.initialPrompt); }, [location.key]);
  useEffect(() => {
    if (!selectedData?.data) return;
    const loaded = selectedData.data.messages.map((message, index): ChatMessage => ({
      id: `${selectedId}-${index}`, role: message.role === 'USER' ? 'user' : 'assistant',
      text: message.content, time: nowLabel(), products: message.productIds,
    }));
    setMessages(loaded.length ? loaded : [welcome]);
  }, [selectedData, selectedId]);

  const sessions = sessionsData?.data || [];
  const filteredSessions = useMemo(() => sessions.filter((session) => {
    const title = session.messages?.[0]?.content || 'New beauty conversation';
    return title.toLowerCase().includes(search.toLowerCase());
  }), [sessions, search]);

  const createNewChat = () => {
    setSelectedId(undefined); setMessages([welcome]); setDraft(''); setNotice('');
    if (location.state) navigate('/assistant', { replace: true, state: null });
  };

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const message = draft.trim();
    if ((!message && !photo) || sendState.isLoading) return;
    if (photo && !photoConsent) { setNotice('Please confirm that you consent to sending this photo for temporary AI analysis.'); return; }
    const next: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: message || 'Please take a look at this photo.', time: nowLabel() };
    const updated = [...messages, next];
    setMessages(updated); setDraft(''); setNotice('');
    const history: AssistantTurn[] = messages.filter((item) => item.id !== 'welcome').slice(-8).map(({ role, text }) => ({ role, text }));
    try {
      const response = await sendMessage({ authenticated: isAuthenticated, message, sessionId: selectedId, history: isAuthenticated ? undefined : history, photo: photo || undefined, photoConsent }).unwrap();
      const result = response.data;
      if (result.sessionId && isAuthenticated) setSelectedId(result.sessionId);
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', text: `${result.reply}\n\n${result.safetyNotice}`, time: nowLabel(), products: result.recommendations?.map((item) => item.productId) || [] }]);
      setPhoto(null); setPhotoConsent(false);
    } catch (error: any) {
      setNotice(error?.data?.message || 'The assistant could not reply right now. Please try again.');
      setMessages((current) => current.filter((item) => item.id !== next.id));
      setDraft(message);
    }
  };

  const onComposerKey = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void submit(); } };
  const addProduct = (product: StoreProduct) => {
    const image = product.media?.find((media) => media.isPrimary)?.imageUrl || product.media?.[0]?.imageUrl || '';
    dispatch(addToCart({ id: product.id, slug: product.slug, name: product.name, price: Number(product.salePrice || product.price), originalPrice: Number(product.price), image, brand: product.brand?.name, category: product.category?.name, openDrawer: true }));
  };
  const speakLatest = () => {
    const latest = [...messages].reverse().find((message) => message.role === 'assistant');
    if (latest && 'speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(latest.text)); }
  };
  const startVoiceInput = () => {
    const w = window as Window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) { setNotice('Voice typing is not supported in this browser. You can still use the message box.'); return; }
    const recognition = new Recognition(); recognition.lang = /[\u0980-\u09ff]/.test(draft) ? 'bn-BD' : 'en-US'; recognition.onresult = (event: any) => setDraft((value) => `${value}${value ? ' ' : ''}${event.results[0][0].transcript}`); recognition.onerror = () => setNotice('Microphone access was not available.'); recognition.start();
  };

  const conversationRows = [
    ...filteredSessions.map((session) => ({ id: session.id, title: session.messages?.[0]?.content || 'New beauty conversation', when: new Date(session.lastMessageAt).toLocaleDateString(), unread: 0 })),
  ];

  return <main className="assistant-shell min-h-screen bg-[#fffafd] text-slate-900">
    <header className="assistant-topbar">
      <Link to="/" aria-label="ShobNow home" className="assistant-brand"><img src={Logo} alt="SHOB Now" /></Link>
      <div className="assistant-title"><div className="assistant-avatar"><Bot className="h-6 w-6" /></div><div><h1>ShobNow AI Beauty Assistant</h1><p><span className="status-dot" /> Online · AI assistant, not a human</p></div></div>
      <div className="assistant-actions"><button aria-label="Read latest reply" title="Read latest reply" onClick={speakLatest}><Volume2 className="h-5 w-5" /></button><button aria-label="Voice input" title="Voice input" onClick={startVoiceInput}><Mic className="h-5 w-5" /></button><button aria-label="Assistant information" title="Assistant information" onClick={() => setShowDetails((value) => !value)}><Info className="h-5 w-5" /></button><button aria-label="Open conversations" className="assistant-mobile-menu" onClick={() => setShowSidebar((value) => !value)}><Menu className="h-5 w-5" /></button></div>
    </header>

    <div className={`assistant-layout ${showDetails ? '' : 'details-hidden'}`}>
      <aside className={`assistant-sidebar ${showSidebar ? 'sidebar-open' : ''}`}>
        <div className="sidebar-heading"><div><h2>Messages <span>{sessions.length}</span></h2><p>Your beauty conversations</p></div><button aria-label="New chat" onClick={createNewChat} className="new-chat"><Plus className="h-5 w-5" /></button></div>
        <label className="conversation-search"><Search className="h-5 w-5" /><input placeholder="Search conversation..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label>
        <div className="conversation-tabs">{(['All', 'Beauty', 'Orders', 'Support'] as const).map((filter) => <button key={filter} className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
        <div className="conversation-list">
          {sessionsLoading ? <p className="sidebar-empty">Loading your conversations…</p> : conversationRows.length ? conversationRows.map((row) => <button key={row.id} onClick={() => { setSelectedId(row.id); setShowSidebar(false); }} className={`conversation-row ${selectedId === row.id ? 'selected' : ''}`}><div className="conversation-avatar"><Bot className="h-5 w-5" /><i /></div><span className="conversation-copy"><strong>{row.title}</strong><small>Open conversation</small></span><span className="conversation-meta">{row.when}</span></button>) : <div className="sidebar-empty"><div className="empty-icon"><Sparkles className="h-5 w-5" /></div><strong>{isAuthenticated ? 'No conversations yet' : 'Temporary chat'}</strong><p>{isAuthenticated ? 'Start a chat and your private history will appear here.' : 'Guest messages stay in this browser session and are not saved to your account.'}</p></div>}
        </div>
        <div className="sidebar-bottom"><div className="privacy-icon"><LockKeyhole className="h-4 w-4" /></div><span><strong>{isAuthenticated ? auth.user?.name : 'Guest session'}</strong><small>{isAuthenticated ? 'Private account history' : 'Temporary conversation'}</small></span><button aria-label="More conversation options" onClick={() => selectedId && void deleteSession(selectedId)} disabled={!selectedId} title="Delete current conversation"><MoreHorizontal className="h-5 w-5" /></button></div>
      </aside>

      <section className="assistant-chat" aria-label="Chat with ShobNow AI">
        <div className="chat-context"><span><Sparkles className="h-4 w-4" /> Beauty Assistant</span><span>Recommendations from the live ShobNow catalog</span></div>
        <div className="chat-messages" ref={scrollRef}>
          <div className="chat-date"><span><Clock3 className="h-3.5 w-3.5" /> TODAY</span></div>
          {productContext && <div className="context-note"><ShoppingBag className="h-4 w-4" /> You opened the assistant from <strong>{productContext}</strong></div>}
          {messages.map((message) => <MessageBubble key={message.id} message={message} onAdd={addProduct} />)}
          {sendState.isLoading && <div className="typing-row"><div className="assistant-avatar small"><Bot className="h-4 w-4" /></div><div className="typing-bubble"><i /><i /><i /></div><span>Checking the catalog…</span></div>}
          {sendState.isLoading && <div className="progress-caption"><span>Finding a helpful answer</span><span>AI response</span></div>}
        </div>
        {!messages.some((message) => message.role === 'user') && <div className="quick-prompts"><span>TRY ASKING</span><button onClick={() => setDraft('I have oily skin. What sunscreen should I look at?')}>Sunscreen for oily skin</button><button onClick={() => setDraft('Can you help me find a gentle moisturizer?')}>Gentle moisturizer</button><button onClick={() => setDraft('What products are good for sensitive skin?')}>Sensitive skin</button></div>}
        {photo && <div className="photo-consent"><div className="photo-chip"><ImageIcon className="h-4 w-4" /><span>{photo.name}</span><button onClick={() => { setPhoto(null); setPhotoConsent(false); }} aria-label="Remove selected photo"><X className="h-4 w-4" /></button></div><label><input type="checkbox" checked={photoConsent} onChange={(event) => setPhotoConsent(event.target.checked)} /> I consent to sending this photo to the configured AI provider for temporary analysis. It is not stored by ShobNow.</label></div>}
        <form className="composer-wrap" onSubmit={submit}><button type="button" className="composer-plus" onClick={() => fileRef.current?.click()} aria-label="Attach a photo"><Plus className="h-6 w-6" /></button><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file && file.size > 5 * 1024 * 1024) { setNotice('Choose a photo under 5 MB.'); return; } setPhoto(file || null); setPhotoConsent(false); }} /><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onComposerKey} placeholder="Type a message..." rows={1} aria-label="Type a message" /><button type="button" className="composer-tool" onClick={() => fileRef.current?.click()} aria-label="Choose image"><ImageIcon className="h-5 w-5" /></button><button type="button" className="composer-tool" onClick={startVoiceInput} aria-label="Voice message"><Mic className="h-5 w-5" /></button><button type="submit" className="send-button" disabled={sendState.isLoading || (!draft.trim() && !photo)} aria-label="Send message"><Send className="h-5 w-5" /></button></form>
        {notice && <p role="alert" className="assistant-alert"><CircleHelp className="h-4 w-4" />{notice}</p>}
        <div className="chat-footnote"><LockKeyhole className="h-3.5 w-3.5" /> Your conversations are private. AI suggestions are informational, not medical advice.</div>
      </section>

      {showDetails && <aside className="assistant-proof">
        <div className="proof-heading"><div className="proof-shield"><ShieldCheck className="h-7 w-7" /></div><div><h2>AI Agent Verification</h2><p>ShobNow AI Beauty Assistant · not human</p></div><button aria-label="Close information panel" onClick={() => setShowDetails(false)}><X className="h-5 w-5" /></button></div>
        <div className="ai-profile"><div className="ai-profile-icon"><img src={aiAssistantAvatar} alt="ShobNow AI assistant avatar" /><i /></div><div><h3>ShobNow AI</h3><span className="ai-label"><Sparkles className="h-3.5 w-3.5" /> AI Assistant</span><p>Beauty Consultant&nbsp; | &nbsp;SHOB Now</p></div></div>
        <h3 className="proof-section-title">Verification &amp; Proof</h3>
        <div className="proof-checks">{proofRows.map(({ icon: Icon, title, detail, status }) => <div key={title}><span className="check-icon"><Icon className="h-5 w-5" /></span><span><strong>{title}</strong><small>{detail}</small></span><span className="truth-status"><Check className="h-3.5 w-3.5" /> {status}</span></div>)}</div>
        <div className="proof-divider" />
        <div className="product-proof-heading"><h3 className="proof-section-title">Product Proof (Store Images)</h3><span>ShobNow</span></div>
        <div className="proof-photo-grid"><img src={proofImageOne} alt="Beauty product from ShobNow catalog" /><img src={proofImageTwo} alt="Skincare product from ShobNow catalog" /><img src={proofImageThree} alt="Beauty care product from ShobNow catalog" /></div>
        <div className="ai-disclosure"><div className="disclosure-badge"><BadgeCheck className="h-7 w-7" /></div><div><strong>ShobNow AI Assistant</strong><p>Get product suggestions and beauty information with confidence. AI generated responses are not medical advice.</p></div></div>
        <div className="support-card"><CircleHelp className="h-5 w-5" /><div><strong>Need a person?</strong><p>Our support team can help with orders and account questions.</p><Link to="/contact">Contact support <ArrowRight className="inline h-4 w-4" /></Link></div></div>
      </aside>}
    </div>
  </main>;
};

export default Assistant;
