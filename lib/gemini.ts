import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// Current model names as of 2026 — tries in order until one works
const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-2.5-flash-lite',
]

export async function generateWithFallback(prompt: string): Promise<string> {
  let lastError: Error | null = null

  for (const modelName of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      })
      const text = response.text
      if (text) return text
    } catch (error) {
      console.log(`Model ${modelName} failed, trying next...`)
      lastError = error as Error
      continue
    }
  }

  throw lastError || new Error('All models failed')
}
