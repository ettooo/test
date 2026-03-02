import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Youtube, Scissors, Download, Zap, CheckCircle2, AlertCircle,
    Loader2, Share2, Trophy, Subtitles, ArrowLeft, Sparkles, Flame
} from 'lucide-react';
import './index.css';

// --- HOME PAGE ---
const HomePage = ({ onProcess }) => {
    const [url, setUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [withSubtitles, setWithSubtitles] = useState(true);
    const navigate = useNavigate();

    const handleStart = async () => {
        if (!url) return;
        setIsProcessing(true);
        const success = await onProcess(url, withSubtitles);
        setIsProcessing(false);
        if (success) navigate('/dashboard');
    };

    return (
        <div className="home-container" style={{ textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                    <Flame size={14} fill="currentColor" /> AI Viral Engine v2.0
                </div>
                <h1>ViralClippy</h1>
                <p className="hero-subtitle">Metti un link di YouTube. La nostra AI estrarrà ogni singolo momento virale trasformandolo in Shorts pronti al download.</p>
            </motion.div>

            <motion.div className="input-section" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <Youtube style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={24} />
                    <input type="text" placeholder="Incolla il link YouTube qui..." value={url} onChange={(e) => setUrl(e.target.value)} style={{ paddingLeft: '4rem' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Subtitles size={20} color={withSubtitles ? 'var(--primary)' : 'var(--text-muted)'} />
                        <span style={{ fontWeight: 600 }}>Sottotitoli Smart</span>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={withSubtitles} onChange={() => setWithSubtitles(!withSubtitles)} />
                        <span className="slider round"></span>
                    </label>
                </div>

                <button className="process-button" onClick={handleStart} disabled={isProcessing || !url}>
                    {isProcessing ? (
                        <><Loader2 className="animate-spin" size={24} /> ANALISI PROFONDA IN CORSO...</>
                    ) : (
                        <><Sparkles size={24} /> ESTRAI CLIP VIRALI (15+)</>
                    )}
                </button>
            </motion.div>
        </div>
    );
};

// --- CLIP CARD COMPONENT with PROGRESS ---
const ClipCard = ({ clip, onDownload, videoId }) => {
    const [progress, setProgress] = useState(0);

    // Mock progress during rendering
    useEffect(() => {
        let interval;
        if (clip.status === 'rendering') {
            setProgress(0);
            interval = setInterval(() => {
                setProgress(prev => (prev < 90 ? prev + (Math.random() * 5) : prev));
            }, 1000);
        } else if (clip.status === 'done') {
            setProgress(100);
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [clip.status]);

    return (
        <motion.div className="clip-card" layout>
            <div className="clip-preview">
                {clip.videoUrl ? (
                    <video src={clip.videoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ position: 'relative', height: '100%' }}>
                        <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Scissors size={40} color="var(--primary)" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.5 }}>SHORTS MODE</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="clip-info">
                <div className="viral-badge">
                    <Trophy size={14} /> VIRAL SCORE: {clip.viralScore}%
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{clip.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', height: '3rem', overflow: 'hidden' }}>{clip.reason}</p>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 600 }}>
                    <span>⏱️ {Math.round(clip.end - clip.start)}s</span>
                    <span>📍 {Math.floor(clip.start / 60)}:{(clip.start % 60).toString().padStart(2, '0')}</span>
                </div>

                {clip.status === 'rendering' && (
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="process-button" style={{ margin: 0, flex: 1, padding: '0.8rem', fontSize: '0.9rem' }} onClick={() => onDownload(clip)} disabled={clip.status === 'rendering'}>
                        {clip.status === 'rendering' ? <Loader2 className="animate-spin" size={18} /> : (clip.status === 'done' ? <CheckCircle2 size={18} /> : <Download size={18} />)}
                        {clip.status === 'rendering' ? `Rendering ${Math.round(progress)}%` : (clip.status === 'done' ? 'Salvato' : 'Scarica')}
                    </button>
                    <button className="process-button" style={{ margin: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', width: '50px', padding: 0 }} onClick={() => alert('Social sharing coming soon!')}>
                        <Share2 size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// --- DASHBOARD PAGE ---
const DashboardPage = ({ clips, onDownload, url }) => {
    const navigate = useNavigate();
    const videoId = (u) => {
        try {
            const urlObj = new URL(u);
            return urlObj.hostname === 'youtu.be' ? urlObj.pathname.slice(1) : urlObj.searchParams.get('v');
        } catch (e) { return '0'; }
    };

    return (
        <div className="dashboard-container">
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4rem',
                background: 'rgba(255,255,255,0.02)',
                padding: '1.5rem 2rem',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
            }}>
                <button onClick={() => navigate('/')} style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1rem',
                    transition: 'all 0.3s'
                }}
                    onMouseOver={(e) => e.target.style.transform = 'translateX(-5px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateX(0)'}
                >
                    <ArrowLeft size={20} /> Torna alla Generator
                </button>
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary), #e11d48)',
                    padding: '0.75rem 2rem',
                    borderRadius: '100px',
                    fontWeight: 950,
                    fontSize: '1rem',
                    boxShadow: '0 0 30px rgba(244, 63, 94, 0.4)',
                    letterSpacing: '1px'
                }}>
                    {clips.length} MOMENTI VIRALI TROVATI
                </div>
            </header>

            <div className="grid-clips">
                <AnimatePresence>
                    {clips.map((clip, idx) => (
                        <ClipCard key={clip.id} clip={clip} onDownload={onDownload} videoId={videoId(url)} />
                    ))}
                </AnimatePresence>
            </div>

            {clips.length === 0 && (
                <div style={{ textAlign: 'center', padding: '10rem 0', opacity: 0.3 }}>
                    <Zap size={64} style={{ marginBottom: '1rem' }} />
                    <h2>In attesa di dati...</h2>
                </div>
            )}
        </div>
    );
};

// --- APP WRAPPER ---
function App() {
    const [clips, setClips] = useState([]);
    const [currentUrl, setCurrentUrl] = useState('');
    const [withSubtitles, setWithSubtitles] = useState(true);

    const handleProcess = async (url, subs) => {
        try {
            setCurrentUrl(url); setWithSubtitles(subs);
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
                    withSubtitles
                })
            });

            const data = await response.json();
            if (data.clipUrl) {
                const fullUrl = `http://localhost:5000${data.clipUrl}`;

                // Fetch the file as a Blob to prevent the browser from navigating or opening a new tab
                const videoRes = await fetch(fullUrl);
                const blob = await videoRes.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `${clip.title.replace(/[^\w\s-]/gi, '') || 'clip'}.mp4`;
                document.body.appendChild(link);
                link.click();
                link.remove();

                // Clean up the URL object
                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

                setClips(prev => prev.map(c => c.id === clip.id ? { ...c, status: 'done', videoUrl: fullUrl } : c));
            }
        } catch (error) {
            console.error('Download error:', error);
            setClips(prev => prev.map(c => c.id === clip.id ? { ...c, status: 'ready' } : c));
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage onProcess={handleProcess} />} />
                <Route path="/dashboard" element={<DashboardPage clips={clips} onDownload={handleDownload} url={currentUrl} />} />
            </Routes>
            <style>{`
                .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.1); transition: .4s; border-radius: 34px; }
                .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .slider { background-color: var(--primary); }
                input:checked + .slider:before { transform: translateX(20px); }
            `}</style>
        </Router>
    );
}

export default App;
