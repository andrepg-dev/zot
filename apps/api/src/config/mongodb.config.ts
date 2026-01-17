import { ConfigService } from "@nestjs/config";

export default () => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    uri: config.get("MONGODB_DATABASE_URL"),
  }),
});
