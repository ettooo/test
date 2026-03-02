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

const ytdl = require('@distube/ytdl-core');
const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

async function test() {
    try {
        console.log('Fetching info...');
        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });
        console.log('Title:', info.videoDetails.title);
        const formats = info.formats.filter(f => f.hasVideo && f.hasAudio);
        console.log('Combined formats found:', formats.length);
        if (formats.length === 0) {
            console.log('No combined formats. Checking video-only...');
            const videoOnly = info.formats.filter(f => f.hasVideo && !f.hasAudio);
            console.log('Video only formats:', videoOnly.length);
        }
    } catch (err) {
        console.error('TEST FAILED:', err.message);
        if (err.stack) console.error(err.stack);
    }
}

test();
