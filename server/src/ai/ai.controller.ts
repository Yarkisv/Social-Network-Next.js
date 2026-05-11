import { Body, Controller, Post } from "@nestjs/common";

import { AiService } from "./ai.service";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("generate-tags")
  async generateTags(@Body("text") text: string) {
    const tags = await this.aiService.generateTags(text);

    console.log(tags);

    return {
      success: true,
      tags,
    };
  }
}
