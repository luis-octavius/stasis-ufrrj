import "dotenv/config";
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
  // You need to provide your Google AI Studio API key.
  // Learn more at https://ai.google.dev/tutorials/setup
  model: "googleai/gemini-2.0-flash", // Using a fast model for quick responses.
});
