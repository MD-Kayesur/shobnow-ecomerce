import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Bot, Check, CheckCheck, CircleHelp, Clock3, LoaderCircle,
  Image as ImageIcon, Info, LockKeyhole, Mail, Menu, MessageSquare, Mic, MoreHorizontal, Phone, Volume2,
  Plus, Search, Send, ShieldCheck, ShoppingBag, Sparkles, Square, X,
} from 'lucide-react';
import Logo from '@/assets/Logo/shobnow-logo.png';
import proofImageOne from '@/assets/products/prod-bien-pink.jpg';
import proofImageTwo from '@/assets/products/prod-peach-colvea.jpg';
import proofImageThree from '@/assets/products/prod-red-jars.jpg';
import aiAssistantAvatar from '@/assets/assistant-ai-avatar.svg';
import './Assistant.css';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/redux-hook';
import { addToCart } from '@/redux/features/cart/cartSlice';
import { useGetMyOrdersQuery, useGetStoreProductQuery, type StoreProduct } from '@/redux/features/storefront/storefrontApi';
import {
  useDeleteAssistantSessionMutation, useGetAssistantSessionQuery,
  useGetAssistantSessionsQuery, useSendAssistantMessageMutation,
  useTranscribeAssistantAudioMutation,
  type AssistantTurn,
} from '@/redux/features/assistant/assistantApi';

type ChatMessage = AssistantTurn & {
  id: string;
  time: string;
  products?: string[];
  image?: string;
};
type GuestThread = { id: string; updatedAt: string; messages: ChatMessage[] };
const GUEST_THREADS_KEY = 'shobnow_assistant_guest_threads_v1';
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const nowLabel = () => new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date());
async function preparePhoto(file: File): Promise<File> {
  if (file.size <= MAX_PHOTO_BYTES) return file;
  const bitmap = await createImageBitmap(file);
  try {
    let scale = Math.min(1, 2200 / Math.max(bitmap.width, bitmap.height));
    for (let attempt = 0; attempt < 7; attempt += 1) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not prepare this photo.');
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.86, 0.78, 0.7, 0.62]) {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (blob && blob.size <= MAX_PHOTO_BYTES) {
          const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo';
          return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
        }
      }
      scale *= 0.82;
    }
    throw new Error('This photo is too large to optimize.');
  } finally {
    bitmap.close();
  }
}
const photoAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not preview this photo.'));
  reader.onerror = () => reject(new Error('Could not preview this photo.'));
  reader.readAsDataURL(file);
});
const welcome: ChatMessage = {
  id: 'welcome', role: 'assistant', time: nowLabel(),
  text: 'Hi! 👋 I’m your ShobNow AI beauty assistant. Tell me about your skin or what you’re looking for, and I’ll help you explore our catalog.',
};
function loadGuestThreads(): GuestThread[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(GUEST_THREADS_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((thread): thread is GuestThread =>
      thread && typeof thread.id === 'string' && Array.isArray(thread.messages),
    ).map((thread) => ({
      id: thread.id,
      updatedAt: typeof thread.updatedAt === 'string' ? thread.updatedAt : new Date().toISOString(),
      messages: thread.messages.filter((item: unknown): item is ChatMessage =>
        Boolean(item && typeof item === 'object' &&
          ['user', 'assistant'].includes(String((item as ChatMessage).role)) &&
          typeof (item as ChatMessage).text === 'string'),
      ).slice(-100).map((item: ChatMessage) => ({
        id: item.id, role: item.role, text: item.text, time: item.time,
        ...(Array.isArray(item.products) ? { products: item.products.filter((id) => typeof id === 'string').slice(0, 5) } : {}),
      })),
    })).filter((thread) => thread.messages.length > 0).slice(0, 20);
  } catch {
    return [];
  }
}
const money = (value: number | string) => `৳${Number(value || 0).toLocaleString('en-BD')}`;
const formatWait = (seconds: number) => seconds >= 60
  ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
  : `${seconds}s`;

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
      <div className={`whitespace-pre-wrap rounded-[22px] px-4 py-3 text-[15px] leading-6 shadow-sm ${user ? 'rounded-br-md bg-gradient-to-br from-pink-600 to-fuchsia-600 text-white' : 'rounded-bl-md border border-pink-100 bg-gradient-to-br from-white to-pink-50/80 text-slate-900'}`}>{message.image && <img src={message.image} alt="Photo attached to this message" className="mb-2 max-h-64 max-w-full rounded-xl object-contain" />}{message.text}
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
  const [guestThreads, setGuestThreads] = useState<GuestThread[]>(loadGuestThreads);
  const [guestSelectedId, setGuestSelectedId] = useState<string | undefined>(() => loadGuestThreads()[0]?.id);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState<string>();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const thread = loadGuestThreads()[0];
    return !isAuthenticated && thread?.messages.length ? thread.messages : [welcome];
  });
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Beauty' | 'Orders' | 'Support'>('Beauty');
  const [showDetails, setShowDetails] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreparing, setPhotoPreparing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);
  const [thinkingStage, setThinkingStage] = useState(0);
  const [sendMessage, sendState] = useSendAssistantMessageMutation();
  const [transcribeAudio, transcribeState] = useTranscribeAssistantAudioMutation();
  const [deleteSession] = useDeleteAssistantSessionMutation();
  const { data: sessionsData, isLoading: sessionsLoading } = useGetAssistantSessionsQuery(undefined, { skip: !isAuthenticated });
  const { data: myOrdersResponse, isLoading: ordersLoading, isError: ordersError, refetch: refetchOrders } = useGetMyOrdersQuery(undefined, { skip: !isAuthenticated || activeFilter !== 'Orders' });
  const { data: selectedData } = useGetAssistantSessionQuery(selectedId || '', { skip: !isAuthenticated || !selectedId });
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const locationContext = location.state as { from?: string; productName?: string; initialPrompt?: string } | null;
  const productContext = locationContext?.productName;

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, sendState.isLoading]);
  useEffect(() => {
    if (!photo) { setPhotoPreview(null); return; }
    const previewUrl = URL.createObjectURL(photo);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [photo]);
  useEffect(() => {
    if (!sendState.isLoading) { setThinkingStage(0); return; }
    const timer = window.setInterval(() => setThinkingStage((stage) => Math.min(stage + 1, 3)), 2500);
    return () => window.clearInterval(timer);
  }, [sendState.isLoading]);
  useEffect(() => {
    if (retryAfterSeconds <= 0) return;
    const timer = window.setTimeout(() => setRetryAfterSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [retryAfterSeconds]);
  useEffect(() => {
    if (isAuthenticated || !guestSelectedId || !messages.some((message) => message.role === 'user')) return;
    const updatedThread: GuestThread = {
      id: guestSelectedId,
      updatedAt: new Date().toISOString(),
      // Guest images are never persisted; only text and catalog product IDs are stored.
      messages: messages.filter((message) => message.id !== 'welcome').slice(-20).map((message) => ({
        ...message,
        image: undefined,
        ...(message.text === 'Please take a look at this photo.' ? { text: '[Photo shared — image not saved]' } : {}),
      })),
    };
    setGuestThreads((current) => {
      const next = [updatedThread, ...current.filter((thread) => thread.id !== guestSelectedId)].slice(0, 20);
      try { window.localStorage.setItem(GUEST_THREADS_KEY, JSON.stringify(next)); } catch { /* Keep the current in-memory conversation if storage is full. */ }
      return next;
    });
  }, [guestSelectedId, isAuthenticated, messages]);
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
    setSelectedId(undefined); setGuestSelectedId(undefined); setMessages([welcome]); setDraft(''); setNotice('');
    if (location.state) navigate('/assistant', { replace: true, state: null });
  };

  const deleteCurrentChat = async () => {
    if (isAuthenticated && selectedId) {
      await deleteSession(selectedId);
      setSelectedId(undefined);
      setMessages([welcome]);
      return;
    }
    if (!guestSelectedId) return;
    const remaining = guestThreads.filter((thread) => thread.id !== guestSelectedId);
    setGuestThreads(remaining);
    try { window.localStorage.setItem(GUEST_THREADS_KEY, JSON.stringify(remaining)); } catch { /* The UI still clears the active thread. */ }
    setGuestSelectedId(undefined);
    setMessages([welcome]);
  };

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const message = draft.trim();
    const attachedPhoto = photo;
    if ((!message && !attachedPhoto) || photoPreparing || sendState.isLoading || retryAfterSeconds > 0) return;
    let image: string | undefined;
    try {
      if (attachedPhoto) image = await photoAsDataUrl(attachedPhoto);
    } catch {
      setNotice('Could not prepare this photo. Please choose it again.');
      return;
    }
    const next: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: message || 'Please take a look at this photo.', time: nowLabel(), image };
    const updated = [...messages, next];
    setMessages(updated); setDraft(''); setNotice('');
    setPhoto(null);
    if (!isAuthenticated) setGuestSelectedId((current) => current || crypto.randomUUID());
    const history: AssistantTurn[] = messages.filter((item) => item.id !== 'welcome').slice(-8).map(({ role, text }) => ({ role, text }));
    try {
      const response = await sendMessage({ authenticated: isAuthenticated, message, sessionId: selectedId, history: isAuthenticated ? undefined : history, photo: attachedPhoto || undefined, photoConsent: Boolean(attachedPhoto) }).unwrap();
      const result = response.data;
      setRetryAfterSeconds(0);
      if (result.sessionId && isAuthenticated) setSelectedId(result.sessionId);
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', text: `${result.reply}\n\n${result.safetyNotice}`, time: nowLabel(), products: result.recommendations?.map((item) => item.productId) || [] }]);
    } catch (error: any) {
      const apiMessage = error?.data?.message;
      if (error?.status === 429) {
        const retryMinutes = Number(String(apiMessage || '').match(/try again in (\d+) minute/i)?.[1] || 1);
        setRetryAfterSeconds(Math.max(1, retryMinutes) * 60);
        setNotice('You’ve sent several messages in a short time. Your text and photo are still here.');
      } else {
        const validationDetails = Array.isArray(error?.data?.errors)
          ? error.data.errors.map((item: { field?: string; message?: string }) => [item.field, item.message].filter(Boolean).join(': ')).join('; ')
          : '';
        const validationMessage = error?.data?.errorDetails?.validationErrors;
        setNotice(validationDetails
          ? `Could not send this message: ${validationDetails}`
          : Array.isArray(validationMessage) && validationMessage.length
            ? `Could not send this message: ${validationMessage.join('; ')}`
            : apiMessage || 'The assistant could not reply right now. Please try again.');
      }
      setMessages((current) => current.filter((item) => item.id !== next.id));
      setDraft(message);
      setPhoto(attachedPhoto);
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
  const startVoiceInput = async () => {
    if (isRecording) {
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setNotice('Voice recording needs a supported browser. Open this page on localhost or HTTPS in the latest Chrome, Edge, or Firefox.');
      return;
    }
    setNotice('');
    try {
      // The browser shows its microphone permission prompt after this user click.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      audioStreamRef.current = stream;
      const preferredType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'].find((mime) => MediaRecorder.isTypeSupported(mime));
      const recorder = preferredType ? new MediaRecorder(stream, { mimeType: preferredType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) audioChunksRef.current.push(event.data); };
      recorder.onerror = () => {
        recorder.onstop = null;
        stream.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
        recorderRef.current = null;
        setIsRecording(false);
        setNotice('The microphone stopped unexpectedly. Check your microphone connection and try again.');
      };
      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
        recorderRef.current = null;
        setIsRecording(false);
        if (!blob.size) { setNotice('No speech detected. Try again.'); return; }
        if (blob.size > 5 * 1024 * 1024) { setNotice('That recording is too long to transcribe. Please record a shorter voice message.'); return; }
        const extension = blob.type.includes('ogg') ? 'ogg' : blob.type.includes('mp4') ? 'm4a' : 'webm';
        const audio = new File([blob], `voice-message.${extension}`, { type: blob.type });
        try {
          const result = await transcribeAudio(audio).unwrap();
          const transcript = result.data.transcript.trim();
          if (!transcript) { setNotice('No speech was detected. Try speaking a little closer to the microphone.'); return; }
          setDraft((value) => `${value}${value ? ' ' : ''}${transcript}`);
          setNotice('');
        } catch (error: any) {
          const message = error?.data?.message;
          setNotice(typeof message === 'string' ? message : 'Voice transcription is temporarily unavailable. Please type your message and try again later.');
        }
      };
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      const name = error instanceof DOMException ? error.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') {
        setNotice('Microphone blocked. Allow it in your browser’s site settings.');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setNotice('No microphone found. Connect or enable one, then try again.');
      } else if (name === 'NotReadableError' || name === 'TrackStartError') {
        setNotice('Microphone is busy in another app. Close it and try again.');
      } else {
        setNotice('Could not start microphone. Check site permission and try again.');
      }
    }
  };

  useEffect(() => () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null;
      recorder.stop();
    }
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const allConversationRows = isAuthenticated
    ? filteredSessions.map((session) => ({ id: session.id, title: session.messages?.[0]?.content || 'New beauty conversation', when: new Date(session.lastMessageAt).toLocaleDateString() }))
    : guestThreads.filter((thread) => thread.messages[0]?.text.toLowerCase().includes(search.toLowerCase())).map((thread) => ({ id: thread.id, title: thread.messages.find((message) => message.role === 'user')?.text || 'Beauty conversation', when: new Date(thread.updatedAt).toLocaleDateString() }));
  const conversationRows = activeFilter === 'All' || activeFilter === 'Beauty' ? allConversationRows : [];

  return <main className="assistant-shell min-h-screen bg-[#fffafd] text-slate-900">
    <header className="assistant-topbar">
      <Link to="/" aria-label="ShobNow home" className="assistant-brand"><img src={Logo} alt="SHOB Now" /></Link>
      <div className="assistant-title"><div className="assistant-avatar"><Bot className="h-6 w-6" /></div><div><h1>ShobNow AI Beauty Assistant</h1><p><span className="status-dot" /> Online · AI assistant, not a human</p></div></div>
      <div className="assistant-actions"><button aria-label="Read latest reply" title="Read latest reply" onClick={speakLatest}><Volume2 className="h-5 w-5" /></button><button aria-label={isRecording ? 'Stop voice recording' : transcribeState.isLoading ? 'Transcribing voice' : 'Start voice recording'} title={isRecording ? 'Stop recording' : transcribeState.isLoading ? 'Transcribing voice…' : 'Record a voice message'} className={isRecording ? 'voice-recording' : ''} onClick={() => void startVoiceInput()} disabled={transcribeState.isLoading || sendState.isLoading}>{transcribeState.isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}</button><button aria-label="Assistant information" title="Assistant information" onClick={() => setShowDetails((value) => !value)}><Info className="h-5 w-5" /></button><button aria-label="Open conversations" className="assistant-mobile-menu" onClick={() => setShowSidebar((value) => !value)}><Menu className="h-5 w-5" /></button></div>
    </header>

    <div className={`assistant-layout ${showDetails ? '' : 'details-hidden'}`}>
      <aside className={`assistant-sidebar ${showSidebar ? 'sidebar-open' : ''}`}>
        <div className="sidebar-heading"><div><h2>Messages <span>{isAuthenticated ? sessions.length : guestThreads.length}</span></h2><p>Your beauty conversations</p></div><button aria-label="New chat" onClick={createNewChat} className="new-chat"><Plus className="h-5 w-5" /></button></div>
        <label className="conversation-search"><Search className="h-5 w-5" /><input placeholder="Search conversation..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label>
        <div className="conversation-tabs">{(['All', 'Beauty', 'Orders', 'Support'] as const).map((filter) => <button key={filter} className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
        <div className="conversation-list">
          {activeFilter === 'Orders' ? !isAuthenticated ? <div className="sidebar-empty"><div className="empty-icon"><ShoppingBag className="h-5 w-5" /></div><strong>Sign in to see your orders</strong><p>Your order list and latest status are private to your account.</p><Link to="/login" className="mt-3 rounded-xl bg-pink-600 px-4 py-2 text-sm font-bold text-white">Sign in</Link></div>
            : ordersLoading ? <p className="sidebar-empty">Loading your orders…</p>
              : ordersError ? <div className="sidebar-empty"><strong>Could not load orders</strong><p>Check your connection and try again.</p><button onClick={() => void refetchOrders()} className="mt-3 rounded-xl border border-pink-200 px-4 py-2 text-sm font-bold text-pink-700">Retry</button></div>
                : (myOrdersResponse?.data || []).length ? (myOrdersResponse?.data || []).filter((order) => `${order.orderNumber} ${order.status}`.toLowerCase().includes(search.toLowerCase())).map((order) => <article key={order.id} className="mx-1 my-2 rounded-2xl border border-pink-100 bg-white p-3 shadow-sm"><div className="flex items-start justify-between gap-2"><strong className="text-sm">#{order.orderNumber}</strong><span className="rounded-full bg-pink-50 px-2 py-1 text-[10px] font-bold text-pink-700">{order.status.replace(/_/g, ' ')}</span></div><p className="mt-1 text-[11px] text-slate-500">{new Date(order.createdAt).toLocaleDateString()} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p><div className="my-2 space-y-1 border-y border-pink-50 py-2">{order.items.slice(0, 3).map((item, index) => <p key={`${order.id}-${index}`} className="truncate text-xs text-slate-700">{item.quantity} × {item.productName}</p>)}{order.items.length > 3 && <p className="text-[10px] text-slate-400">and {order.items.length - 3} more</p>}</div><div className="flex items-center justify-between"><strong className="text-sm">৳{Number(order.total).toLocaleString('en-BD')}</strong><a className="text-[11px] font-bold text-pink-700" href={`mailto:support@shownow.com.bd?subject=${encodeURIComponent(`Help with order ${order.orderNumber}`)}&body=${encodeURIComponent(`Hello, I need help with order ${order.orderNumber}.`)}`}>Get help</a></div></article>) : <div className="sidebar-empty"><div className="empty-icon"><ShoppingBag className="h-5 w-5" /></div><strong>No orders yet</strong><p>Orders you place while signed in will appear here with their current status.</p><Link to="/shop" className="mt-3 rounded-xl bg-pink-600 px-4 py-2 text-sm font-bold text-white">Browse the shop</Link></div>
          : activeFilter === 'Support' ? <div className="mx-1 my-3 space-y-3 rounded-2xl border border-pink-100 bg-white p-4"><div className="empty-icon"><CircleHelp className="h-5 w-5" /></div><strong className="block text-sm">Contact ShobNow support</strong><p className="text-xs leading-5 text-slate-500">Talk to the team about delivery, returns, payments, or your account.</p><a href="tel:+8809612345678" className="flex items-center gap-2 rounded-xl border border-pink-100 px-3 py-2.5 text-xs font-semibold text-slate-700"><Phone className="h-4 w-4 text-pink-600" />Call +880 9612-345678</a><a href="https://wa.me/8801712345678" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-pink-100 px-3 py-2.5 text-xs font-semibold text-slate-700"><MessageSquare className="h-4 w-4 text-pink-600" />WhatsApp support</a><a href="mailto:support@shownow.com.bd" className="flex items-center gap-2 rounded-xl border border-pink-100 px-3 py-2.5 text-xs font-semibold text-slate-700"><Mail className="h-4 w-4 text-pink-600" />Email support</a><Link to="/contact" className="block text-center text-xs font-bold text-pink-700">More contact details <ArrowRight className="inline h-3.5 w-3.5" /></Link></div>
            : sessionsLoading ? <p className="sidebar-empty">Loading your conversations…</p> : conversationRows.length ? conversationRows.map((row) => <button key={row.id} onClick={() => { if (isAuthenticated) setSelectedId(row.id); else { const thread = guestThreads.find((item) => item.id === row.id); if (thread) { setGuestSelectedId(thread.id); setMessages(thread.messages); } } setShowSidebar(false); }} className={`conversation-row ${(isAuthenticated ? selectedId : guestSelectedId) === row.id ? 'selected' : ''}`}><div className="conversation-avatar"><Bot className="h-5 w-5" /><i /></div><span className="conversation-copy"><strong>{row.title}</strong><small>{isAuthenticated ? 'Private account chat' : 'Saved on this device'}</small></span><span className="conversation-meta">{row.when}</span></button>) : <div className="sidebar-empty"><div className="empty-icon"><Sparkles className="h-5 w-5" /></div><strong>{isAuthenticated ? 'No conversations yet' : 'Start a chat'}</strong><p>{isAuthenticated ? 'Start a chat and your private history will appear here.' : 'Guest messages save on this device and stay here after you reload. They are not saved to your account.'}</p></div>}
        </div>
        <div className="sidebar-bottom"><div className="privacy-icon"><LockKeyhole className="h-4 w-4" /></div><span><strong>{isAuthenticated ? auth.user?.name : 'Guest session'}</strong><small>{isAuthenticated ? 'Private account history' : 'Saved on this device'}</small></span><button aria-label="Delete current conversation" onClick={() => void deleteCurrentChat()} disabled={isAuthenticated ? !selectedId : !guestSelectedId} title="Delete current conversation"><MoreHorizontal className="h-5 w-5" /></button></div>
      </aside>

      <section className="assistant-chat" aria-label="Chat with ShobNow AI">
        <div className="chat-context"><span><Sparkles className="h-4 w-4" /> Beauty Assistant</span><span>Recommendations from the live ShobNow catalog</span></div>
        <div className="chat-messages" ref={scrollRef}>
          <div className="chat-date"><span><Clock3 className="h-3.5 w-3.5" /> TODAY</span></div>
          {productContext && <div className="context-note"><ShoppingBag className="h-4 w-4" /> You opened the assistant from <strong>{productContext}</strong></div>}
          {messages.map((message) => <MessageBubble key={message.id} message={message} onAdd={addProduct} />)}
          {sendState.isLoading && <div className="assistant-thinking" role="status" aria-live="polite"><div className="assistant-avatar small"><Bot className="h-4 w-4" /></div><div className="thinking-card"><div className="thinking-heading"><span className="thinking-spark"><Sparkles className="h-4 w-4" /></span><div><strong>ShobNow AI is working</strong><p>{['Reading your message', 'Preparing a helpful reply', 'Checking relevant store information', 'Still working on a careful answer'][thinkingStage]}<span className="thinking-ellipsis">...</span></p></div></div><div className="thinking-track"><i /></div><div className="thinking-footer"><span>Usually takes a few seconds</span><span className="thinking-dots"><i /><i /><i /></span></div></div></div>}
        </div>
        {!messages.some((message) => message.role === 'user') && <div className="quick-prompts"><span>TRY ASKING</span><button onClick={() => setDraft('I have oily skin. What sunscreen should I look at?')}>Sunscreen for oily skin</button><button onClick={() => setDraft('Can you help me find a gentle moisturizer?')}>Gentle moisturizer</button><button onClick={() => setDraft('What products are good for sensitive skin?')}>Sensitive skin</button></div>}
        <form className={`composer-wrap ${photo ? 'has-attachment' : ''}`} onSubmit={submit}>
          {photo && <div className="composer-attachment-preview"><img src={photoPreview || ''} alt={photo.name} /><span className="attachment-details"><strong>{photo.name}</strong><small>Sent for AI analysis with your message</small></span><button type="button" onClick={() => setPhoto(null)} aria-label="Remove attached image"><X className="h-4 w-4" /></button></div>}
          <button type="button" className="composer-plus" onClick={() => fileRef.current?.click()} aria-label="Attach a photo"><Plus className="h-6 w-6" /></button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={async (event) => { const input = event.currentTarget; const file = input.files?.[0]; if (!file) return; setPhotoPreparing(true); setNotice(''); try { setPhoto(await preparePhoto(file)); } catch { setNotice('Could not optimize this photo. Choose a smaller image.'); } finally { setPhotoPreparing(false); input.value = ''; } }} />
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onComposerKey} placeholder="Type a message..." rows={1} aria-label="Type a message" />
          <button type="button" className="composer-tool" onClick={() => fileRef.current?.click()} aria-label="Choose image"><ImageIcon className="h-5 w-5" /></button>
          <button type="button" className={`composer-tool ${isRecording ? 'voice-recording' : ''}`} onClick={() => void startVoiceInput()} disabled={transcribeState.isLoading || sendState.isLoading} aria-label={isRecording ? 'Stop voice recording' : transcribeState.isLoading ? 'Transcribing voice' : 'Record a voice message'} title={isRecording ? 'Stop recording' : transcribeState.isLoading ? 'Transcribing voice…' : 'Record a voice message'}>{transcribeState.isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}</button>
          <button type="submit" className="send-button" disabled={photoPreparing || sendState.isLoading || transcribeState.isLoading || isRecording || retryAfterSeconds > 0 || (!draft.trim() && !photo)} aria-label={retryAfterSeconds > 0 ? `Try sending in ${formatWait(retryAfterSeconds)}` : 'Send message'} title={retryAfterSeconds > 0 ? `Try again in ${formatWait(retryAfterSeconds)}` : 'Send message'}>{photoPreparing ? <LoaderCircle className="h-5 w-5 animate-spin" /> : retryAfterSeconds > 0 ? <span className="text-[10px] font-bold">{formatWait(retryAfterSeconds)}</span> : <Send className="h-5 w-5" />}</button>
        </form>
        {notice && <p role="alert" className="assistant-alert">{retryAfterSeconds > 0 ? <Clock3 className="h-4 w-4" /> : <CircleHelp className="h-4 w-4" />}{retryAfterSeconds > 0 ? `Please wait ${formatWait(retryAfterSeconds)} before sending again. Your text and selected photo are kept.` : notice}</p>}
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
