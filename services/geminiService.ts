import { GoogleGenAI, Type } from "@google/genai";
import { NewsArticle, InsuranceProduct, LoanProduct, SystemUpdate, AccountType, VerificationLevel } from '../types';

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
    
    const errorString = (error as Error).toString();
    if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
        const rateLimitNote = "Our AI is currently experiencing high demand. In the meantime, experience the future of global finance with ApexBank's seamless international transfers, offering unparalleled speed and bank-grade security.";
        const result = { note: rateLimitNote, isError: true };
        // Cache the rate-limited response to avoid retries for this session.
        tipCache.set(introNoteCacheKey, { tip: result.note, isError: result.isError });
        return result;
    }

    // Generic error fallback
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

const newsCache = new Map<string, FinancialNewsResult>();
const newsCacheKey = 'financialNews';

export const getFinancialNews = async (): Promise<FinancialNewsResult> => {
  if (newsCache.has(newsCacheKey)) {
    return newsCache.get(newsCacheKey)!;
  }

  if (!ai) {
    const result = {
      articles: [
        { title: 'Global Markets Show Mixed Signals', summary: 'Major indices are fluctuating as investors weigh inflation concerns against positive corporate earnings.', category: 'Market Analysis' },
        { title: 'USD Strengthens Against EUR', summary: 'The US Dollar has gained ground following the latest Federal Reserve meeting minutes.', category: 'Currency Update' },
        { title: 'New Trade Agreements Boost Asian Economies', summary: 'Recently signed trade pacts are expected to increase export volumes for several key Asian markets.', category: 'Economic Outlook' },
      ],
      isError: false,
    };
    newsCache.set(newsCacheKey, result);
    return result;
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
    const result = { articles, isError: false };
    newsCache.set(newsCacheKey, result);
    return result;

  } catch (error) {
    console.error("Error fetching financial news from Gemini:", error);
    
    const errorString = (error as Error).toString();
    let result: FinancialNewsResult;

    if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
        result = {
             articles: [
                { title: 'AI News Feed Unavailable', summary: 'Our AI-powered news feed is currently at capacity. Please check back later.', category: 'System Alert' }
             ],
             isError: true,
        };
    } else {
        // Generic error (like the 500 reported)
        result = {
            articles: [
                { title: 'AI News Feed Unavailable', summary: 'We are experiencing a temporary issue with our AI news service. Please try again later.', category: 'System Alert' }
            ],
            isError: true,
        };
    }
    newsCache.set(newsCacheKey, result); // Cache the error response
    return result;
  }
};


const insuranceCache = new Map<string, { product: InsuranceProduct | null; isError: boolean }>();

export const getInsuranceProductDetails = async (productName: string): Promise<{ product: InsuranceProduct | null; isError: boolean; }> => {
  if (insuranceCache.has(productName)) {
    return insuranceCache.get(productName)!;
  }

  if (!ai) {
    // Fallback data if Gemini is not available
    const fallbackData: { [key: string]: InsuranceProduct } = {
        'Transfer Protection': {
            name: 'Transfer Protection',
            description: 'Secure your international money transfers against unforeseen circumstances. With Transfer Protection, your funds are safeguarded from the moment you hit send until they safely arrive.',
            benefits: ['Full reimbursement for lost or stolen funds.', 'Coverage for transaction errors or delays.', '24/7 priority support for claims.'],
        },
        'Global Travel Insurance': {
            name: 'Global Travel Insurance',
            description: 'Travel the world with peace of mind. Our comprehensive travel insurance covers medical emergencies, trip cancellations, lost baggage, and more, so you can focus on your journey.',
            benefits: ['Up to $1,000,000 in emergency medical coverage.', 'Trip cancellation and interruption protection.', 'Worldwide assistance services.'],
        },
        'Device Protection': {
            name: 'Device Protection',
            description: 'Protect the devices you rely on every day. Our Device Protection plan covers your smartphone, laptop, and tablet against accidental damage, theft, and mechanical breakdown.',
            benefits: ['Coverage for screen cracks and liquid damage.', 'Theft and loss protection worldwide.', 'Fast repair or replacement process.'],
        },
    };
    const product = fallbackData[productName] || null;
    const result = { product, isError: !product };
    if(product) insuranceCache.set(productName, result);
    return result;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a compelling marketing description and exactly 3 key benefits for a financial insurance product called "${productName}" offered by a fintech bank. The tone should be professional, reassuring, and modern.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: 'A compelling, one-paragraph marketing description for the insurance product.'
            },
            benefits: {
              type: Type.ARRAY,
              description: 'A list of exactly three key benefits of the product.',
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    
    const parsedJson = JSON.parse(response.text);
    const product: InsuranceProduct = {
        name: productName,
        description: parsedJson.description,
        benefits: parsedJson.benefits
    };

    const result = { product, isError: false };
    insuranceCache.set(productName, result);
    return result;
  } catch (error) {
    console.error(`Error fetching insurance details for ${productName} from Gemini:`, error);
    const errorString = (error as Error).toString();
    if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
        // Fallback with a rate-limited message
        const rateLimitResult = {
            product: {
                name: productName,
                description: 'AI-powered product details are currently unavailable due to high demand. Please check back later.',
                benefits: ['Comprehensive coverage information will be available soon.'],
            },
            isError: true,
        };
        insuranceCache.set(productName, rateLimitResult);
        return rateLimitResult;
    }
    return { product: null, isError: true };
  }
};

const loanCache = new Map<string, { products: LoanProduct[]; isError: boolean }>();

export const getLoanProducts = async (): Promise<{ products: LoanProduct[]; isError: boolean; }> => {
    const cacheKey = 'allLoanProducts';
    if (loanCache.has(cacheKey)) {
        return loanCache.get(cacheKey)!;
    }

    if (!ai) {
        const fallbackProducts: LoanProduct[] = [
            { id: 'personal', name: 'Personal Loan', description: 'Flexible financing for life\'s big moments. Consolidate debt, fund a home renovation, or cover unexpected expenses with a predictable monthly payment.', benefits: ['Competitive fixed rates', 'No origination fees', 'Flexible terms from 24-60 months'], interestRate: { min: 6.99, max: 19.99 } },
            { id: 'auto', name: 'Auto Loan', description: 'Get behind the wheel faster with our streamlined auto financing. We offer competitive rates for new and used vehicles, with a quick and easy application process.', benefits: ['Rates as low as 4.49% APR', 'Finance up to 100% of vehicle value', 'Pre-approval in minutes'], interestRate: { min: 4.49, max: 12.49 } },
            { id: 'mortgage', name: 'Home Mortgage', description: 'Your dream home is within reach. We offer a variety of mortgage options, including fixed-rate and adjustable-rate loans, to fit your unique financial situation.', benefits: ['Dedicated mortgage advisor', 'Online application and document portal', 'Competitive closing costs'], interestRate: { min: 5.75, max: 7.25 } },
        ];
        const result = { products: fallbackProducts, isError: false };
        loanCache.set(cacheKey, result);
        return result;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a financial product manager for a modern fintech bank. Generate details for three distinct loan products: a Personal Loan, an Auto Loan, and a Home Mortgage. For each product, provide a unique id (personal, auto, mortgage), a compelling one-paragraph marketing description, a list of exactly three key benefits, and a realistic min/max interest rate range. The tone should be professional, empowering, and clear.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        loanProducts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    interestRate: { type: Type.OBJECT, properties: { min: { type: Type.NUMBER }, max: { type: Type.NUMBER } } }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const parsedJson = JSON.parse(response.text);
        const result = { products: parsedJson.loanProducts, isError: false };
        loanCache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Error fetching loan products from Gemini:", error);
        const errorString = (error as Error).toString();
        const result = { products: [], isError: true };
        if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
            loanCache.set(cacheKey, result);
        }
        return result;
    }
};

const supportCache = new Map<string, { answer: string; isError: boolean }>();

export const getSupportAnswer = async (query: string): Promise<{ answer: string; isError: boolean; }> => {
  if (supportCache.has(query)) {
    return supportCache.get(query)!;
  }

  if (!ai) {
    const fallbackAnswer = `Thank you for your question about "${query}". While our AI assistant is currently offline, you can find answers to common questions in our help center or contact our support team directly for assistance.`;
    return { answer: fallbackAnswer, isError: false };
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a friendly and helpful customer support AI for ApexBank. A customer has asked the following question: "${query}". Provide a clear, concise, and helpful answer. Use formatting like bolding for key terms and bullet points for lists if it makes the answer easier to understand. Do not invent features that don't exist. Be professional and reassuring.`,
      config: { temperature: 0.3, maxOutputTokens: 250 }
    });
    const result = { answer: response.text, isError: false };
    supportCache.set(query, result);
    return result;
  } catch (error) {
    console.error(`Error fetching support answer for "${query}" from Gemini:`, error);
    const errorString = (error as Error).toString();
    const result = { answer: "I'm sorry, but I was unable to process your request at this time. Please try rephrasing your question or contact our human support team for assistance.", isError: true };
    if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
        result.answer = "Our AI assistant is currently experiencing high demand. Please try again in a few moments or contact our human support team."
        supportCache.set(query, result);
    }
    return result;
  }
};

const updatesCacheKey = 'systemUpdates';
const updatesCache = new Map<string, { updates: SystemUpdate[]; isError: boolean }>();

export const getSystemUpdates = async (): Promise<{ updates: SystemUpdate[]; isError: boolean; }> => {
    if (updatesCache.has(updatesCacheKey)) {
        return updatesCache.get(updatesCacheKey)!;
    }
    
    if (!ai) {
        const fallbackUpdates: SystemUpdate[] = [
            { id: '1', title: 'Mobile App Update v2.1', date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'The latest version of our mobile app with performance improvements and a new dark mode is now available on the App Store and Google Play.', category: 'Improvement' },
            { id: '2', title: 'Instant Card Provisioning', date: new Date(Date.now() - 86400000 * 7).toISOString(), description: 'You can now instantly provision your ApexBank card to Apple Pay and Google Wallet right from the app.', category: 'New Feature' },
            { id: '3', title: 'Scheduled Maintenance', date: new Date(Date.now() - 86400000 * 14).toISOString(), description: 'We will be undergoing scheduled maintenance this Saturday at 11 PM UTC to improve our infrastructure. The app may be temporarily unavailable.', category: 'Maintenance' },
        ];
        const result = { updates: fallbackUpdates, isError: false };
        updatesCache.set(updatesCacheKey, result);
        return result;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `As the communications manager for ApexBank, generate a list of 3 recent, synthetic system updates. The response must be a JSON object containing an 'updates' array. Each object in the array should have a unique id, title, description, an ISO 8601 date within the last month, and a category ('New Feature', 'Improvement', or 'Maintenance').`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        updates: {
                            type: Type.ARRAY,
                            description: "A list of recent system updates and announcements.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING, description: "A unique, non-repeating identifier for the update, e.g., 'update-123'." },
                                    title: { type: Type.STRING, description: "The title of the update." },
                                    date: { type: Type.STRING, description: "The date of the announcement in a valid ISO 8601 format (e.g., '2024-07-15T10:00:00Z')." },
                                    description: { type: Type.STRING, description: "A brief summary of the changes." },
                                    category: { 
                                        type: Type.STRING, 
                                        enum: ['New Feature', 'Improvement', 'Maintenance'],
                                        description: "The category of the update."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const parsedJson = JSON.parse(response.text);
        const result = { updates: parsedJson.updates, isError: false };
        updatesCache.set(updatesCacheKey, result);
        return result;
    } catch (error) {
        console.error("Error fetching system updates from Gemini:", error);
        const errorString = (error as Error).toString();
        const result = { updates: [], isError: true };
        if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
            updatesCache.set(updatesCacheKey, result);
        }
        return result;
    }
};

const accountPerksCache = new Map<string, { perks: string[]; isError: boolean }>();

export const getAccountPerks = async (accountType: AccountType, verificationLevel: VerificationLevel): Promise<{ perks: string[]; isError: boolean }> => {
    const cacheKey = `${accountType}-${verificationLevel}`;
    if (accountPerksCache.has(cacheKey)) {
        return accountPerksCache.get(cacheKey)!;
    }
    
    if (!ai) {
        const fallbackPerks: { [key in AccountType]?: string[] } = {
            [AccountType.CHECKING]: ['Real-time fraud monitoring', 'Customizable spending alerts', 'FDIC insured up to $250,000'],
            [AccountType.SAVINGS]: ['High-yield interest rate', 'Secure vault for long-term savings', 'Automated goal tracking'],
            [AccountType.BUSINESS]: ['Multi-user access controls', 'Advanced transaction categorization', 'Integration with accounting software'],
        };
        const perks = fallbackPerks[accountType] || ['Enhanced security features', '24/7 customer support'];
        return { perks, isError: false };
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `As a banking security expert, generate a list of exactly 3 compelling, modern security perks for a "${accountType}" account for a customer who is at "${verificationLevel}" verification status. Higher verification levels should unlock more advanced perks. For example, a "Verified+" user might get enhanced insurance or proactive monitoring. The tone should be reassuring and professional.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        perks: {
                            type: Type.ARRAY,
                            description: 'A list of exactly three key security perks.',
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const parsedJson = JSON.parse(response.text);
        const result = { perks: parsedJson.perks, isError: false };
        accountPerksCache.set(cacheKey, result);
        return result;

    } catch (error) {
        console.error("Error fetching account perks from Gemini:", error);
        const errorString = (error as Error).toString();
        const result = { perks: [], isError: true };
        if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
            accountPerksCache.set(cacheKey, result);
        }
        return result;
    }
};