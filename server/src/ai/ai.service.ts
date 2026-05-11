import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class AiService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async generateTags(text: string): Promise<string[]> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You analyze social media posts.

Return ONLY JSON array.

Rules:
- lowercase only
- max 5 tags
- no explanations

Example:
["dota2", "gaming", "esports"]
`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const response = completion.choices[0].message.content;

    return JSON.parse(response || "[]");
  }
}
