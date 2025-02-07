import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function getChatResponse(messages: ChatMessage[]) {
  try {
    const systemMessage = {
      role: "system",
      content: "You are a helpful AI assistant. Please provide your responses in natural language. Include 'json' in your first response to enable JSON formatting.",
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    throw new Error("Failed to get chat response: " + error.message);
  }
}