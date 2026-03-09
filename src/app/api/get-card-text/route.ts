import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  // Ensure the key exists
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ text: "API Key Missing" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = "Give me exactly two opposite words separated by a slash (e.g., 'Hot / Cold'). No punctuation or extra sentences.";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const wordPair = response.text().trim();

    return Response.json({ text: wordPair });
  } catch (error) {
    console.error("Gemini Error:", error);
    return Response.json({ text: "Error fetching words" }, { status: 500 });
  }
}
