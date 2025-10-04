import { GoogleGenAI, Type } from "@google/genai";
import { NewsArticle } from '../types';

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

export interface BankingTipResult {
  tip: string;
  isError: boolean;
}

// In-memory cache for banking tips to avoid redundant API calls.
const tipCache = new Map<string, BankingTipResult>();
const introNoteCacheKey = 'bankIntroNote';

export const getCountryBankingTip = async (countryName: string): Promise<BankingTipResult> => {
  // Return cached tip if available.
  if (tipCache.has(countryName)) {
    return tipCache.get(countryName)!;
  }

  // FIX: Check for the instantiated 'ai' client rather than the API key directly.
  if (!ai) {
    const result: BankingTipResult = {
      tip: `Standard banking information is required for ${countryName}.`,
      isError: false, // This is a fallback, not a hard error.
    };
    tipCache.set(countryName, result); // Cache the fallback message.
    return result;
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
    
    const result: BankingTipResult = { tip: response.text, isError: false };
    // Cache the successful response.
    tipCache.set(countryName, result);
    return result;
  } catch (error) {
    console.error("Error fetching banking tip from Gemini:", error);
    // Do not cache errors to allow for retries.
    return {
      tip: `Could not fetch banking tips at the moment. Please ensure you have the correct details.`,
      isError: true,
    };
  }
};

export interface BankIntroNoteResult {
  note: string;
  isError: boolean;
}

export const getBankIntroNote = async (): Promise<BankIntroNoteResult> => {
  if (tipCache.has(introNoteCacheKey)) {
    const cachedResult = tipCache.get(introNoteCacheKey)!;
    return { note: cachedResult.tip, isError: cachedResult.isError };
  }

  if (!ai) {
    const fallbackNote = "Experience the future of global finance. ApexBank offers seamless international transfers with unparalleled speed, transparency, and bank-grade security, empowering you to move money with confidence.";
    const result: BankIntroNoteResult = { note: fallbackNote, isError: false };
    tipCache.set(introNoteCacheKey, { tip: result.note, isError: result.isError });
    return result;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "You are the AI strategist for ApexBank, a modern fintech specializing in fast, secure, and transparent international money transfers. Write a short, intelligent, and welcoming note (2-3 sentences) for our landing page. The note should highlight why a user should choose us. Mention key themes like global reach, speed, and bank-grade security without using a boring list. The tone should be confident, modern, and inspiring.",
      config: {
        temperature: 0.5,
        maxOutputTokens: 100,
      }
    });
    
    const result: BankIntroNoteResult = { note: response.text, isError: false };
    tipCache.set(introNoteCacheKey, { tip: result.note, isError: result.isError });
    return result;
  } catch (error) {
    console.error("Error fetching bank intro note from Gemini:", error);
    return {
      note: `We're currently experiencing high traffic. Our mission is to provide seamless global finance with top-tier security. We invite you to explore how.`,
      isError: true,
    };
  }
};


export interface FinancialNewsResult {
  articles: NewsArticle[];
  isError: boolean;
}

export const getFinancialNews = async (): Promise<FinancialNewsResult> => {
  if (!ai) {
    return {
      articles: [
        { title: 'Global Markets Show Mixed Signals', summary: 'Major indices are fluctuating as investors weigh inflation concerns against positive corporate earnings.', category: 'Market Analysis' },
        { title: 'USD Strengthens Against EUR', summary: 'The US Dollar has gained ground following the latest Federal Reserve meeting minutes.', category: 'Currency Update' },
        { title: 'New Trade Agreements Boost Asian Economies', summary: 'Recently signed trade pacts are expected to increase export volumes for several key Asian markets.', category: 'Economic Outlook' },
      ],
      isError: false,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate 3 synthetic, brief financial news headlines and summaries relevant to international finance and currency exchange. For each, provide a title, a short summary (1-2 sentences), and a category like 'Market Analysis', 'Currency Update', or 'Economic Outlook'. Return ONLY a valid JSON array of objects, with no surrounding text or markdown formatting. The format should be exactly: [{\"title\": \"...\", \"summary\": \"...\", \"category\": \"...\"}, ...].",
    });

    let jsonString = response.text.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7, jsonString.length - 3).trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.substring(3, jsonString.length - 3).trim();
    }
    
    const articles = JSON.parse(jsonString);
    return { articles, isError: false };

  } catch (error) {
    console.error("Error fetching financial news from Gemini:", error);
    return {
      articles: [],
      isError: true,
    };
  }
};