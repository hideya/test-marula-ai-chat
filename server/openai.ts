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
      content: "You are a helpful AI assistant. Please provide your responses in natural language.",
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

export async function generateThreadTitle(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "あなたはチャット履歴からタイトルを生成するアシスタントです。会話の内容を20文字以内で要約してタイトルとして返してください。余計な説明は不要です。",
        },
        ...messages.slice(-3), // 最新の3つのメッセージのみを使用
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    const title = response.choices[0].message?.content?.trim() || "New Chat";
    console.log("Generated title:", title); // デバッグログ
    return title;
  } catch (error: any) {
    console.error("Failed to generate title:", error);
    return "New Chat";
  }
}