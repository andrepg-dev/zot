import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AiServerConnectionService {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async message_to_ai(message: string, userId: string): Promise<{ agent_response: string }> {
    const AI_URL_SERVICE = this.configService.get("AI_URL_SERVICE");

    const result = await firstValueFrom(
      this.http.post(AI_URL_SERVICE, { message, user_id: userId }),
    );

    return result.data;
  }
}
