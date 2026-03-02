import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Youtube, Scissors, Download, Zap, CheckCircle2,
    Loader2, Share2, Trophy, ArrowLeft, Sparkles, Flame,
    Search, Play, Heart, Clock, LayoutGrid, Subtitles,
    ChevronDown, Mail, Lock, Eye, Plus, Minus, Twitter, Send
} from 'lucide-react';
import './index.css';

// --- MATERIAL 3 COMPONENTS ---

const TopAppBar = () => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`m3-top-app-bar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--m3-primary-container), var(--m3-primary))',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                        <Scissors size={24} style={{ transform: 'rotate(-45deg)' }} />
                    </div>
                    <span className="m3-logo-text">ViralClippy</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="m3-button-tonal" style={{ background: 'transparent' }} onClick={() => navigate('/login')}>Sign in</button>
                    <button className="m3-button-filled" onClick={() => navigate('/signup')}>Get Started</button>
                </div>
            </div>
        </header>
    );
};

const MaterialCard = ({ icon, title, desc }) => (
    <div className="m3-card m3-card-elevated">
        <div style={{ color: 'var(--m3-primary)', marginBottom: '16px' }}>{icon}</div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
        <p style={{ color: 'var(--m3-on-surface-variant)', fontSize: '0.95rem' }}>{desc}</p>
    </div>
);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const faqs = [
        { q: "Come funziona l'AI di ViralClippy?", a: "La nostra AI analizza l'audio e il video per identificare momenti di alta tensione, battute o cambi di argomento, estraendo automaticamente le clip più ingaggianti." },
        { q: "Posso scegliere lo stile dei sottotitoli?", a: "Sì! Offriamo diversi stili, tra cui il celebre 'Hormozi Style' con colori vivaci e animazioni dinamiche per massimizzare la ritenzione." },
        { q: "Quali piattaforme sono supportate?", a: "Puoi incollare link da YouTube, Twitch, Vimeo e molti altri. I video vengono esportati in formato 9:16 perfetto per TikTok e Reels." }
    ];

    return (
        <section className="container faq-section">
            <h2 style={{ fontSize: '2rem', marginBottom: '32px', fontFamily: 'Syne' }}>Domande Frequenti</h2>
            {faqs.map((faq, i) => (
                <div key={i} className={`faq-item ${openIndex === i ? 'active' : ''}`} onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
                    <div className="faq-question">
                        {faq.q} {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                    <div className="faq-answer">{faq.a}</div>
                </div>
            ))}
        </section>
    );
};

const AuthPage = ({ type }) => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh' }}>
            <TopAppBar />
            <motion.div className="auth-container" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ background: 'var(--m3-surface-container-low)', padding: '48px', borderRadius: '32px', border: '1px solid var(--m3-outline)' }}>
                    <h2 style={{ fontSize: '2rem', fontFamily: 'Syne', marginBottom: '8px' }}>
                        {type === 'login' ? 'Bentornato' : 'Crea Account'}
                    </h2>
                    <p style={{ color: 'var(--m3-on-surface-variant)', marginBottom: '32px' }}>
                        {type === 'login' ? 'Inserisci le tue credenziali' : 'Inizia la tua prova gratuita oggi'}
                    </p>
                    <div className="auth-form">
                        <input className="m3-input" type="email" placeholder="Email" />
                        <input className="m3-input" type="password" placeholder="Password" />
                        <button className="m3-button-filled" style={{ marginTop: '16px' }} onClick={() => navigate('/')}>
                            {type === 'login' ? 'Accedi' : 'Continua'}
                        </button>
                    </div>
                    <p style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--m3-on-surface-variant)' }}>
                        {type === 'login' ? "Non hai un account?" : "Hai già un account?"}
                        <span style={{ color: 'var(--m3-primary)', cursor: 'pointer', marginLeft: '8px' }} onClick={() => navigate(type === 'login' ? '/signup' : '/login')}>
                            {type === 'login' ? 'Registrati' : 'Accedi'}
                        </span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

// --- PAGES ---

const HomePage = ({ onProcess }) => {
    const [url, setUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [withSubtitles, setWithSubtitles] = useState(true);
    const navigate = useNavigate();

    const handleStart = async (e) => {
        e.preventDefault();
        if (!url) return;
        setIsProcessing(true);
        const success = await onProcess(url, withSubtitles);
        setIsProcessing(false);
        if (success) navigate('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            <TopAppBar />

            <section className="hero-section container">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="badge-tonal" style={{ borderRadius: '100px', padding: '8px 20px', marginBottom: '32px' }}>
                        <Sparkles size={16} /> powered by Gemini 1.5
                    </span>
                    <h1 className="hero-title">Video Intelligence per Creator</h1>
                    <p className="hero-subtitle">
                        Rilevazione automatica dei momenti migliori, sottotitoli smart e reframe verticale. Tutto con un clic.
                    </p>
                </motion.div>

                <form className="input-container" onSubmit={handleStart}>
                    <div style={{ padding: '0 16px', color: 'var(--m3-on-surface-variant)' }}><Youtube size={24} /></div>
                    <input type="text" placeholder="Incolla il link del video..." value={url} onChange={(e) => setUrl(e.target.value)} />
                    <button type="submit" className="m3-button-filled" disabled={isProcessing} style={{ height: '56px', borderRadius: '32px', padding: '0 32px' }}>
                        {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={20} /> Estrai Momenti</>}
                    </button>
                </form>

                <div className="container" style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                    <div className="m3-card" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '100px', background: 'var(--m3-surface-container)' }}>
                        <Subtitles size={20} color={withSubtitles ? 'var(--m3-primary)' : 'var(--m3-on-surface-variant)'} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sottotitoli Virali (Hormozi Style)</span>
                        <label className="m3-switch">
                            <input type="checkbox" checked={withSubtitles} onChange={() => setWithSubtitles(!withSubtitles)} />
                            <span className="m3-slider"></span>
                        </label>
                    </div>
                </div>
            </section>

            <section className="container features-grid">
                <MaterialCard
                    icon={<Scissors size={32} />}
                    title="Smart Cut"
                    desc="L'AI identifica i ganci più potenti e i momenti ad alta ritenzione."
                />
                <MaterialCard
                    icon={<Flame size={32} />}
                    title="Viral Predictor"
                    desc="Calcolo del punteggio di virale basato su trend attuali e dati storici."
                />
                <MaterialCard
                    icon={<LayoutGrid size={32} />}
                    title="Multi-Platform"
                    desc="Esporta direttamente in formato ottimizzato per TikTok, Reels e Shorts."
                />
            </section>

            <FAQ />
        </div>
    );
};

const ClipCard = ({ clip, onDownload, videoId }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (clip.status === 'rendering') {
            setProgress(0);
            interval = setInterval(() => setProgress(prev => (prev < 90 ? prev + (Math.random() * 5) : prev)), 1000);
        } else if (clip.status === 'done') setProgress(100);
        return () => clearInterval(interval);
    }, [clip.status]);

    const handleShare = (platform) => {
        const shareUrl = clip.videoUrl ? `http://localhost:5000${clip.videoUrl}` : window.location.href;
        const text = encodeURIComponent(`Guarda questa clip virale: ${clip.title}`);

        const links = {
            whatsapp: `https://api.whatsapp.com/send?text=${text}%20${shareUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
            telegram: `https://t.me/share/url?url=${shareUrl}&text=${text}`,
            general: () => {
                if (navigator.share) navigator.share({ title: clip.title, text: clip.title, url: shareUrl });
                else { navigator.clipboard.writeText(shareUrl); alert("Link copiato!"); }
            }
        };

        if (platform === 'general') links.general();
        else window.open(links[platform], '_blank');
    };

    return (
        <motion.div className="clip-card" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="clip-preview">
                {clip.videoUrl ? (
                    <video src={clip.videoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ position: 'relative', height: '100%' }}>
                        <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--m3-primary)' }}>
                            <Play size={48} fill="currentColor" />
                        </div>
                    </div>
                )}
            </div>
            <div className="clip-info">
                <div className="badge-tonal"><Trophy size={14} /> Score: {clip.viralScore}%</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--m3-on-surface)' }}>{clip.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--m3-on-surface-variant)', marginBottom: '24px', minHeight: '3em' }}>{clip.reason}</p>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div className="m3-chip"><Clock size={14} style={{ marginRight: '6px' }} /> {Math.round(clip.end - clip.start)}s</div>
                    <div className="m3-chip"><LayoutGrid size={14} style={{ marginRight: '6px' }} /> 9:16</div>
                </div>

                {clip.status === 'rendering' && (
                    <div className="progress-indicator">
                        <div className="progress-active" style={{ width: `${progress}%` }}></div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="m3-button-filled" style={{ flex: 1 }} onClick={() => onDownload(clip)} disabled={clip.status === 'rendering'}>
                        {clip.status === 'rendering' ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                        {clip.status === 'rendering' ? `In corso...` : (clip.status === 'done' ? 'Salvato' : 'Genera & Scarica')}
                    </button>
                    <button className="m3-button-tonal" style={{ padding: '0 12px' }} onClick={() => handleShare('general')}><Share2 size={20} /></button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--m3-outline)' }}>
                    <button className="m3-button-tonal" style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }} onClick={() => handleShare('whatsapp')}>WhatsApp</button>
                    <button className="m3-button-tonal" style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }} onClick={() => handleShare('telegram')}>Telegram</button>
                </div>
            </div>
        </motion.div>
    );
};

const DashboardPage = ({ clips, onDownload, url }) => {
    const [sortOrder, setSortOrder] = useState('high');
    const navigate = useNavigate();

    const sortedClips = [...clips].sort((a, b) => {
        return sortOrder === 'high' ? b.viralScore - a.viralScore : a.viralScore - b.viralScore;
    });

    const videoId = (u) => {
        try { const urlObj = new URL(u); return urlObj.hostname === 'youtu.be' ? urlObj.pathname.slice(1) : urlObj.searchParams.get('v'); }
        catch (e) { return '0'; }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            <TopAppBar />
            <div className="container dashboard-header">
                <button onClick={() => navigate('/')} className="m3-button-tonal" style={{ marginBottom: '32px' }}>
                    <ArrowLeft size={20} /> Esci
                </button>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Dashboard Clip</h2>
                        <p style={{ color: 'var(--m3-on-surface-variant)' }}>Trovati {clips.length} momenti ad alto potenziale.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select
                            style={{ background: 'var(--m3-surface-container)', color: 'white', padding: '12px', borderRadius: '12px', border: '1px solid var(--m3-outline)' }}
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="high">Più Virali ⚡</option>
                            <option value="low">Meno Virali ❄️</option>
                        </select>

                        <div className="m3-card-elevated" style={{ padding: '12px 24px', borderRadius: '16px', display: 'flex', gap: '24px' }}>
                            <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 800 }}>{clips.length}</div><div style={{ fontSize: '0.7rem', color: 'var(--m3-on-surface-variant)' }}>CLIPS</div></div>
                            <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 800 }}>88%</div><div style={{ fontSize: '0.7rem', color: 'var(--m3-on-surface-variant)' }}>AVG SCORE</div></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container grid-clips">
                <AnimatePresence>
                    {sortedClips.map(clip => <ClipCard key={clip.id} clip={clip} onDownload={onDownload} videoId={videoId(url)} />)}
                </AnimatePresence>
            </div>

            {clips.length === 0 && (
                <div className="container" style={{ textAlign: 'center', padding: '80px', opacity: 0.5 }}>
                    <Search size={64} style={{ marginBottom: '16px' }} />
                    <h3>Nessuna clip trovata. Riprova con un altro video.</h3>
                </div>
            )}
        </div>
    );
};

// --- APP WRAPPER ---
function App() {
    const [clips, setClips] = useState([]);
    const [currentUrl, setCurrentUrl] = useState('');
    const [wantsSubtitles, setWantsSubtitles] = useState(true);

    const handleProcess = async (url, subToggle) => {
        try {
            setCurrentUrl(url);
            setWantsSubtitles(subToggle);
            const response = await fetch('http://localhost:5000/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await response.json();
            if (data.moments) {
                setClips(data.moments.map((m, i) => ({ ...m, id: Date.now() + i, status: 'ready' })));
                return true;
            }
            return false;
        } catch (e) { return false; }
    };

    const handleDownload = async (clip) => {
        setClips(prev => prev.map(c => c.id === clip.id ? { ...c, status: 'rendering' } : c));
        try {
            const response = await fetch('http://localhost:5000/api/clip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: currentUrl,
                    start: clip.start,
                    end: clip.end,
                    title: clip.title,
                    withSubtitles: wantsSubtitles
                })
            });
            const data = await response.json();
            if (data.clipUrl) {
                const fullUrl = `http://localhost:5000${data.clipUrl}`;
                const videoRes = await fetch(fullUrl);
                const blob = await videoRes.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `${clip.title.replace(/[^\w\s-]/gi, '') || 'clip'}.mp4`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
                setClips(prev => prev.map(c => c.id === clip.id ? { ...c, status: 'done', videoUrl: fullUrl } : c));
            }
        } catch (error) { setClips(prev => prev.map(c => c.id === clip.id ? { ...c, status: 'ready' } : c)); }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage onProcess={handleProcess} />} />
                <Route path="/dashboard" element={<DashboardPage clips={clips} onDownload={handleDownload} url={currentUrl} />} />
                <Route path="/login" element={<AuthPage type="login" />} />
                <Route path="/signup" element={<AuthPage type="signup" />} />
            </Routes>
        </Router>
    );
}

export default App;
