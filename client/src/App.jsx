import React, { useState } from 'react';
import './index.css';

function App() {
    const [url, setUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [clips, setClips] = useState([]);
    const [withSubtitles, setWithSubtitles] = useState(true);

    const handleProcess = async () => {
        if (!url) return;
        setIsProcessing(true);
        setClips([]);

        try {
            const response = await fetch('http://localhost:5000/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();
            if (data.moments) {
                setClips(data.moments.map((m, i) => ({ ...m, id: i + 1, status: 'ready' })));
            } else if (data.error) {
                alert(`Server Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert(`Impossible collegarsi al server. Assicurati che il backend sia attivo sulla porta 5000.`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async (clip) => {
        clip.status = 'rendering';
        setClips([...clips]);

        try {
            const response = await fetch('http://localhost:5000/api/clip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, start: clip.start, end: clip.end, title: clip.title, withSubtitles })
            });

            const data = await response.json();
            if (data.clipUrl) {
                const fullUrl = `http://localhost:5000${data.clipUrl}`;
                window.open(fullUrl, '_blank');
                clip.status = 'done';
                clip.videoUrl = fullUrl;
            } else {
                alert(`Render fallito: ${data.error || 'Verifica i log del server.'}`);
                clip.status = 'ready';
            }
        } catch (error) {
            alert(`Errore nel download: ${error.message}. Verifica che il server sia attivo.`);
            clip.status = 'ready';
        } finally {
            setClips([...clips]);
        }
    };

    const handlePostToSocial = async (clip) => {
        alert(`Preparazione post per: ${clip.title}. Questa funzione richiede API Keys di Instagram/TikTok.`);
    };

    return (
        <div className="app-container">
            <header>
                <h1>ViralClippy</h1>
                <p className="hero-subtitle">Convert long YouTube videos into viral TikToks and Reels in one click. AI-powered selection, instant cropping.</p>
            </header>

            <div className="input-section">
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Paste YouTube link here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                <button
                    className="process-button"
                    onClick={handleProcess}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Analyzing Moments...' : 'Generate Shorts'}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <input
                        type="checkbox"
                        id="subtitles"
                        checked={withSubtitles}
                        onChange={() => setWithSubtitles(!withSubtitles)}
                        style={{ width: '20px', cursor: 'pointer' }}
                    />
                    <label htmlFor="subtitles" style={{ cursor: 'pointer' }}>Aggiungi Sottotitoli Automatici</label>
                </div>
            </div>

            <div className="grid-clips">
                {clips.map(clip => (
                    <div key={clip.id} className="clip-card">
                        <div className="clip-preview">
                            {clip.videoUrl ? (
                                <video src={clip.videoUrl} controls style={{ width: '100%', height: '100%' }} />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img src={`https://img.youtube.com/vi/${new URLSearchParams(new URL(url).search).get('v')}/hqdefault.jpg`} alt="Preview" style={{ width: '100%', opacity: 0.5 }} />
                                    <span style={{ position: 'absolute' }}>9:16 Preview</span>
                                </div>
                            )}
                        </div>
                        <div className="clip-info">
                            <div className="clip-title">{clip.title}</div>
                            <div className="clip-meta">Duration: {clip.end - clip.start}s • Potential: {clip.viralScore || 'AI Selected'}</div>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className="process-button"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                    onClick={() => handlePostToSocial(clip)}
                                >
                                    Post to Instagram
                                </button>
                                <button
                                    className="process-button"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'white', color: 'black' }}
                                    onClick={() => handleDownload(clip)}
                                    disabled={clip.status === 'rendering'}
                                >
                                    {clip.status === 'rendering' ? 'Rendering...' : (clip.status === 'done' ? 'Download' : 'Render & Download')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
