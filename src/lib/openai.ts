import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_MODELS = {
  chat: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o",
  vision: process.env.OPENAI_VISION_MODEL ?? "gpt-4o",
} as const;

/** Shared disclaimer injected anywhere Vinci AI states a value, rarity, or authenticity opinion. */
export const AI_VALUATION_DISCLAIMER =
  "This analysis is AI-generated and informational only. It is not a professional authentication or appraisal, and should not be the sole basis for a financial decision.";

/** Shared disclaimer for AI Forecast / prediction sections. */
export const AI_PREDICTION_DISCLAIMER =
  "This is an AI-generated prediction based on patterns in your activity. It is speculative and not financial advice.";
