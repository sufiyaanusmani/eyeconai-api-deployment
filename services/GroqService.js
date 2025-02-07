const Groq = require('groq-sdk');

class GroqService {
    constructor() {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }

    async extractNormalConditions(description) {
        const prompt = `Generate exactly 5 normal activities from this scene description.

        Scene Description:
        ${description}

        Strict output rules:
        - Return ONLY a JSON array
        - No markdown formatting
        - No explanations
        - No additional text
        - Each description must:
        * Start with "a photo of"
        * Use present continuous tense (-ing)
        * Avoid adjectives
        * No OR/AND statements
        * Use simple English
        * Maximum 50 characters
        * One activity per line

        Example format:
        [{"description": "a photo of person walking through door"}]

        Return only the JSON array, nothing else.`;

        try {
            const completion = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama3-70b-8192",
                temperature: 0.2,
                max_tokens: 1024,
            });

            let response = completion.choices[0].message.content;
            
            // Clean the response by removing markdown code blocks if present
            response = this.cleanResponse(response);

            const parsedResponse = JSON.parse(response);
            this.validateNormalConditions(parsedResponse);

            return parsedResponse;
        } catch (error) {
            console.error('[ERROR] Groq API error:', error);
            throw new Error('Failed to process scene description: ' + error.message);
        }
    }

    cleanResponse(response) {
        // Remove ```json or ``` from start and end of response
        return response
            .replace(/^```json\s*/, '')  // Remove ```json from start
            .replace(/^```\s*/, '')      // Remove ``` from start
            .replace(/\s*```$/, '')      // Remove ``` from end
            .trim();                     // Remove any extra whitespace
    }

    validateNormalConditions(conditions) {
        if (!Array.isArray(conditions)) {
            throw new Error('Response must be an array');
        }

        conditions.forEach((condition, index) => {
            if (!condition.description || typeof condition.description !== 'string') {
                throw new Error(`Invalid description in condition ${index + 1}`);
            }
            if (condition.description.length < 10) {
                throw new Error(`Description ${index + 1} is too short`);
            }
        });
    }
}

module.exports = new GroqService();