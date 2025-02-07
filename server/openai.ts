import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function getChatResponse(messages: ChatMessage[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      response_format: { type: "json_object" },
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    throw new Error("Failed to get chat response: " + error.message);
  }
}