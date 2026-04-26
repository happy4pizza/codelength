import Anthropic from "@anthropic-ai/sdk";

export async function GET(request: Request) {
  // Ensure the key exists
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ text: "Anthropic API Key Missing" }, { status: 500 });
  }

  // Get theme from query parameters
  const url = new URL(request.url);
  const theme = url.searchParams.get('theme');

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  const basePrompt = "Give me exactly two opposite words separated by a slash (e.g., 'Hot / Cold'). No punctuation or extra sentences.";
  const prompt = theme ? `${basePrompt} The theme should be ${theme}.` : basePrompt;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const wordPair = message.content[0].type === 'text' ? message.content[0].text.trim() : 'Error: Unexpected response format';

    return Response.json({ text: wordPair });
  } catch (error) {
    console.error("Claude Error:", error);
    return Response.json({ text: "Error fetching words" }, { status: 500 });
  }
}
