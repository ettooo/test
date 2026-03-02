const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const youtubedl = require('youtube-dl-exec');

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Generates an SRT file for a specific time range.
 */
function generateSrt(transcriptItems, start, end, outputPath) {
    const filtered = transcriptItems.filter(item => {
        const itemStart = item.offset / 1000;
        return itemStart >= start && itemStart <= end;
    });

    let srtContent = '';
    filtered.forEach((item, index) => {
        const sStart = item.offset / 1000 - start;
        const sEnd = (item.offset + item.duration) / 1000 - start;

        const formatTime = (t) => {
            const h = Math.floor(t / 3600).toString().padStart(2, '0');
            const m = Math.floor((t % 3600) / 60).toString().padStart(2, '0');
            const s = Math.floor(t % 60).toString().padStart(2, '0');
            const ms = Math.floor((t % 1) * 1000).toString().padStart(3, '0');
            return `${h}:${m}:${s},${ms}`;
        };

        srtContent += `${index + 1}\n${formatTime(sStart)} --> ${formatTime(sEnd)}\n${item.text}\n\n`;
    });

    fs.writeFileSync(outputPath, srtContent);
}

/**
 * Clips a video and converts it to vertical (9:16) format with subtitles.
 */
async function createClip(videoUrl, outputPath, start, end, withSubtitles, transcriptItems = []) {
    const tempInput = outputPath.replace('.mp4', '_temp.mp4');
    const tempSrt = outputPath.replace('.mp4', '.srt');

    // Ensure clips directory exists
    const clipsDir = path.dirname(outputPath);
    if (!fs.existsSync(clipsDir)) {
        fs.mkdirSync(clipsDir, { recursive: true });
    }

    try {
        const ffmpegDir = path.dirname(ffmpegPath);
        console.log(`[1/2] Downloading segment. FFmpeg dir: ${ffmpegDir}`);

        // Download the segment directly to a temp file
        await youtubedl(videoUrl, {
            output: tempInput,
            format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            downloadSections: `*${start}-${end}`,
            forceOverwrites: true,
            noPart: true,
            ffmpegLocation: ffmpegPath, // Some versions take the file path
        }, {
            // We inject the ffmpeg directory into the process PATH so yt-dlp finds it
            env: {
                ...process.env,
                PATH: `${ffmpegDir}${path.delimiter}${process.env.PATH}`,
                // yt-dlp specific env var
                FFMPEG_BINARY: ffmpegPath
            }
        });

        if (!fs.existsSync(tempInput)) {
            throw new Error("yt-dlp failed to create the temporary input file.");
        }

        console.log(`[2/2] Processing vertical crop with FFmpeg...`);

        return new Promise((resolve, reject) => {
            const filters = [
                'crop=min(iw\\,ih*9/16):ih',
                'scale=1080:1920:force_original_aspect_ratio=increase',
                'crop=1080:1920'
            ];

            if (withSubtitles && transcriptItems.length > 0) {
                generateSrt(transcriptItems, start, end, tempSrt);
                const escapedSrtPath = tempSrt.replace(/\\/g, '/').replace(/:/g, '\\:');
                filters.push(`subtitles='${escapedSrtPath}':force_style='Alignment=2,FontSize=24'`);
            }

            ffmpeg(tempInput)
                .videoFilters(filters)
                .on('start', (command) => console.log('FFmpeg started:', command))
                .on('end', () => {
                    // Cleanup
                    if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
                    if (fs.existsSync(tempSrt)) fs.unlinkSync(tempSrt);
                    console.log('Rendering complete:', outputPath);
                    resolve(outputPath);
                })
                .on('error', (err) => {
                    console.error('FFmpeg Error:', err.message);
                    if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
                    reject(err);
                })
                .save(outputPath);
        });
    } catch (error) {
        console.error('Clipping Process Error:', error.message);
        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
        throw error;
    }
}

module.exports = { createClip };
