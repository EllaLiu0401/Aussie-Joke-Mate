import { GoogleGenAI, Type } from "@google/genai";
import { JokeData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a witty Australian English teacher and comedian. 
Your goal is to help a non-native English learner understand Australian culture and language through humour.
Generate a short, clean, legal joke that uses Australian English.
The joke can be about daily life, office work, trades (tradies), nature, or social situations.

Requirements:
1. content: The setup of the joke.
2. punchline: The punchline.
3. whyItsFunny: Explain the humour, specifically pointing out puns, wordplay, or cultural context.
4. slang: Extract any Australian slang terms used and define them.
5. vocabulary: Extract any difficult English words (IELTS Band 7+) and define them.
6. category: A short tag for the topic (e.g., "Workplace", "Nature", "Pub Culture").

Output must be valid JSON.
`;

export const generateAustralianJoke = async (): Promise<JokeData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Tell me a new Australian joke suitable for learning English.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            punchline: { type: Type.STRING },
            whyItsFunny: { type: Type.STRING },
            containsWordplay: { type: Type.BOOLEAN },
            containsSlang: { type: Type.BOOLEAN },
            slang: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
              },
            },
            vocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
              },
            },
            category: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const parsed = JSON.parse(text);

    // Add client-side ID and timestamp
    return {
      ...parsed,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error("Error generating joke:", error);
    throw error;
  }
};