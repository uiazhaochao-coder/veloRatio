
import { GoogleGenAI, Type } from "@google/genai";
import { AIAdviceResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGearAdvice = async (
  frontTeeth: number,
  rearTeeth: number,
  cadence: number,
  speedKmh: number,
  gradient: number,
  windKmh: number,
  powerWatts: number,
  totalWeight: number
): Promise<AIAdviceResponse> => {
  try {
    const modelId = "gemini-2.5-flash";
    const prompt = `
      I am riding a road bike with a 2x11 setup (48/32T Front, 11-32T Rear).
      Current Status:
      - Front Chainring: ${frontTeeth}T
      - Rear Cog: ${rearTeeth}T
      - Cadence: ${cadence} RPM
      - Speed: ${speedKmh.toFixed(1)} km/h
      - Gradient (Slope): ${gradient}%
      - Wind: ${windKmh > 0 ? `${windKmh} km/h Headwind` : windKmh < 0 ? `${Math.abs(windKmh)} km/h Tailwind` : 'Calm'}
      - Est. Power Output: ${Math.round(powerWatts)} Watts
      - Total System Weight: ${totalWeight} kg

      Analyze this specific gear combination and riding scenario.
      1. Is this efficiently geared for the current gradient, wind, and power?
      2. Am I likely cross-chaining?
      3. Provide a specific cycling tip based on the power-to-weight effort and environmental resistance.

      Return JSON matching this schema:
      {
        "advice": "string (max 2 sentences)",
        "category": "climbing" | "sprinting" | "cruising" | "cross-chain" | "neutral"
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['climbing', 'sprinting', 'cruising', 'cross-chain', 'neutral'] }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAdviceResponse;
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return {
      advice: "Keep pedaling! Maintain a smooth cadence for optimal efficiency.",
      category: "neutral"
    };
  }
};
