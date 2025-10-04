import { GoogleGenAI } from "@google/genai";

// FIX: Conditionally initialize the Gemini AI client only if an API key is available.
// This prevents a runtime error if process.env.API_KEY is undefined and ensures
// the application remains functional (with AI features disabled) as intended.
let ai: GoogleGenAI | undefined;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
  // In a real app, you'd handle this more gracefully.
  // For this MVP, we will log a warning. The app will function without it.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

export const getCountryBankingTip = async (countryName: string): Promise<string> => {
  // FIX: Check for the instantiated 'ai' client rather than the API key directly.
  if (!ai) {
    return `Standard banking information is required for ${countryName}.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a very short, one-sentence tip for sending money to a bank account in ${countryName}. For example, for Germany mention IBAN, for the UK mention Sort Code. Be concise and helpful.`,
      config: {
        temperature: 0.2,
        maxOutputTokens: 50,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching banking tip from Gemini:", error);
    return `Ensure you have the correct bank details for ${countryName}.`;
  }
};
