import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { EvaluationResult, Word } from "../types";
import { decodeAudioData, playAudioBuffer, base64ToUint8Array } from "../utils/audioUtils";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Generate Word Details (for when user adds a manual word)
export const generateWordDetails = async (text: string): Promise<Partial<Word>> => {
  const prompt = `
    Provide details for the English word "${text}" suitable for a Grade 6 elementary student in China.
    Return JSON format.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      phonetic: { type: Type.STRING, description: "IPA phonetic transcription" },
      definition: { type: Type.STRING, description: "Simple definition in English" },
      example: { type: Type.STRING, description: "A simple example sentence using the word" },
    },
    required: ["phonetic", "definition", "example"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Error generating word details:", error);
    throw error;
  }
};

// 2. Text-to-Speech (Model reading the word)
export const playWordPronunciation = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say the word: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Friendly female voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      // Create context with specific sample rate for raw PCM
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const audioBytes = base64ToUint8Array(base64Audio);
      // Decode raw PCM
      const audioBuffer = decodeAudioData(audioBytes, audioContext, 24000, 1);
      
      playAudioBuffer(audioContext, audioBuffer);
    }
  } catch (error) {
    console.error("Error generating speech:", error);
    alert("Could not play audio. Please try again.");
  }
};

// 3. Evaluate User Pronunciation (Audio + Target Word)
export const evaluatePronunciation = async (
  audioBase64: string,
  targetWord: string
): Promise<EvaluationResult> => {
  const prompt = `
    You are a friendly English teacher for primary school students.
    Listen to the attached audio. The student is trying to say the word "${targetWord}".
    
    1. Score their pronunciation from 0 to 100. Be encouraging but realistic.
    2. Provide feedback in Chinese (Simplified).
    3. Identify if any specific part was unclear (Suggestion).
    4. Give a short cheerful encouraging phrase.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER },
      feedback: { type: Type.STRING, description: "Constructive feedback in Chinese" },
      suggestion: { type: Type.STRING, description: "Specific phoneme advice in Chinese/English mix" },
      encouragement: { type: Type.STRING, description: "Short cheer in Chinese" },
    },
    required: ["score", "feedback", "suggestion", "encouragement"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "audio/webm", // Changed to webm to match Recorder output
              data: audioBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Evaluation failed");
  } catch (error) {
    console.error("Evaluation Error:", error);
    throw error;
  }
};