import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { ApiKeyService } from "../../api-key/api-key.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, "api-key") {
  constructor(private readonly apiKeyService: ApiKeyService) {
    super(
      {
        header: "Authorization",
        prefix: "",
      },
      false,
    );
  }

  async validate(apiKey: string, done: (err: Error | null, user?: object, info?: object) => void) {
    const user = await this.apiKeyService.findUserByApiKey(apiKey.trim());
    return done(null, { userId: user?._id.toString() });
  }
}
