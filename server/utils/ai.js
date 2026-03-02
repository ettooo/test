const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function findKeyMoments(transcript) {
    // If the API key is missing or the default placeholder, skip the call and return mock data
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        console.warn('GEMINI_API_KEY is not set. Using mock data.');
        return [
            { "start": 10, "end": 40, "title": "Momento Mock (API Key mancante)", "reason": "Engaging content placeholder" },
            { "start": 60, "end": 90, "title": "Analisi Fallback", "reason": "Viral peak placeholder" }
        ];
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        Analyze this YouTube video transcript and identify the most viral, engaging, or key moments that would make great short-form content (Reels, TikTok, Shorts).
        For each moment, provide:
        1. Start time (seconds)
        2. End time (seconds)
        3. A brief, catchy title for the clip.
        4. Why it's viral.

        Transcript:
        ${transcript}

        Return the results in valid JSON format like this:
        [
          {"start": 10, "end": 40, "title": "The Big Reveal", "reason": "High emotional peak"},
          ...
        ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\[.*\]/s);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
        console.error('Error during AI analysis:', error.message);
        // Fallback to mock data on error
        return [
            { "start": 30, "end": 60, "title": "Fallback Moment (Errore API)", "reason": "Data recovered gracefully" }
        ];
    }
}

module.exports = { findKeyMoments };
