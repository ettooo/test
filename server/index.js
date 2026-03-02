require('dotenv').config();
// Polyfills for Node 18.16 complexity
const { Blob } = require('node:buffer');
if (!global.Blob) global.Blob = Blob;
if (!global.File) {
    global.File = class File extends Blob {
        constructor(parts, filename, options = {}) {
            super(parts, options);
            this.name = filename;
            this.lastModified = options.lastModified || Date.now();
        }
    };
}

const express = require('express');
const cors = require('cors');
const { findKeyMoments } = require('./utils/ai');
const { createClip } = require('./utils/video');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log every request
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Mock storage for simplicity (should use a DB in production)
let transcriptsStore = new Map();

const { YoutubeTranscript } = require('youtube-transcript');
const path = require('path');

app.post('/api/analyze', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        console.log(`Analyzing: ${url}`);

        // Extract video ID from URL
        let videoId = url;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.slice(1);
            } else {
                videoId = urlObj.searchParams.get('v');
            }
        } catch (e) {
            // Assume it's already an ID or a malformed URL
        }

        if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

        console.log(`Fetching transcript for: ${videoId}`);
        const transcriptData = await YoutubeTranscript.fetchTranscript(videoId).catch(err => {
            console.warn('Transcript not found.');
            return [];
        });

        // Save transcript for clipping process
        transcriptsStore.set(url, transcriptData);

        const transcriptText = transcriptData.map(t => t.text).join(' ') || "Fallback: This video has no captions.";

        const moments = await findKeyMoments(transcriptText.slice(0, 10000)); // Limit for prompt size
        res.json({ moments });
    } catch (error) {
        console.error('SERVER ERROR during analyze:', error);
        res.status(500).json({ error: 'Analysis failed on server' });
    }
});

// Serve static clips
app.use('/clips', express.static(path.join(__dirname, 'public/clips')));

app.post('/api/clip', async (req, res) => {
    const { url, start, end, title, withSubtitles } = req.body;
    console.log(`Clipping request: ${url} (${start}-${end}) Subs: ${withSubtitles}`);

    try {
        const id = Date.now();
        const outputFilename = `clip_${id}.mp4`;
        const outputPath = path.join(__dirname, 'public/clips', outputFilename);

        const transcriptItems = transcriptsStore.get(url) || [];

        await createClip(url, outputPath, parseFloat(start), parseFloat(end), withSubtitles, transcriptItems);

        res.json({
            success: true,
            clipUrl: `/clips/${outputFilename}`,
            title
        });
    } catch (error) {
        console.error('CLIPPING ERROR:', error);
        res.status(500).json({ error: 'Clipping failed: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('SERVER ERROR:', err);
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});
