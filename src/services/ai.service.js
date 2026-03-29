const axios = require('axios');
const config = require('../config');

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`;

/**
 * Analyze feedback using Google Gemini API.
 *
 * @param {string} title - Feedback title
 * @param {string} description - Feedback description
 * @returns {Object|null} Parsed AI analysis or null on failure
 */
const analyzeFeedback = async (title, description) => {
    const prompt = `You are a feedback analysis AI. Analyze the following user feedback and return ONLY a valid JSON object with no additional text, markdown, or explanation.

Feedback Title: "${title}"
Feedback Description: "${description}"

Return STRICTLY this JSON format:
{
  "category": "<one of: Bug, Feature Request, Improvement, Other>",
  "sentiment": "<one of: Positive, Neutral, Negative>",
  "priority_score": <number from 1 to 10>,
  "summary": "<brief one-line summary>",
  "tags": ["<relevant>", "<tags>"]
}

Rules:
- priority_score must be an integer between 1 (low) and 10 (critical)
- tags should be 2-5 relevant keywords
- Return ONLY the JSON object, nothing else`;

    try {
        const response = await axios.post(
            GEMINI_API_URL,
            {
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 256,
                },
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 15000,
            }
        );

        // Extract the text from Gemini's response
        const rawText =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            console.error('❌ Gemini returned empty response');
            return null;
        }

        // Clean markdown code fences if present (```json ... ```)
        const cleaned = rawText
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/g, '')
            .trim();

        const parsed = JSON.parse(cleaned);

        // Validate expected fields exist
        if (
            !parsed.category ||
            !parsed.sentiment ||
            parsed.priority_score === undefined ||
            !parsed.summary ||
            !Array.isArray(parsed.tags)
        ) {
            console.error('❌ Gemini response missing required fields:', parsed);
            return null;
        }

        return parsed;
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error('❌ Failed to parse Gemini response as JSON:', error.message);
        } else if (error.response) {
            console.error(
                '❌ Gemini API error:',
                error.response.status,
                error.response.data?.error?.message || error.message
            );
        } else {
            console.error('❌ Gemini request failed:', error.message);
        }

        // Never crash — return null so the caller can proceed without AI data
        return null;
    }
};

module.exports = { analyzeFeedback };
