import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import * as fs from "fs";
import { AppModule } from "./app.module";

const processLogger = new Logger("Process");
process.on("uncaughtException", (error) => {
  processLogger.error(`Uncaught exception: ${error.message}`, error.stack);
});
process.on("unhandledRejection", (reason) => {
  processLogger.error(`Unhandled rejection: ${String(reason)}`);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Class validator activation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Zot API")
    .setDescription(
      `
#### Overview
Zot API provides a comprehensive solution for managing waitlists and user authentication

#### Rate Limiting
API requests are subject to rate limiting. Please handle 429 responses appropriately.
    `.trim(),
    )
    .setVersion("1.0.0")
    .setContact("Zot Team", "https://zot.so", "support@zot.so")
    .addServer(process.env.API_URL ?? "http://localhost:3010", "Current Environment")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter your JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .addTag("Health", "API health check endpoints")
    .addTag("Auth", "Authentication and authorization endpoints")
    .addTag("Subscriptions", "Stripe subscription and billing endpoints")
    .addTag("WaitList", "Waitlist management endpoints")
    .addTag("WaitList Users", "Waitlist user registration and management")
    .addTag("React to HTML", "React component to HTML conversion")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync("./openapi.json", JSON.stringify(document, null, 2));

  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: "monokai",
      },
    },
    customSiteTitle: "Zot API Documentation",
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { font-size: 2.5em }
    `,
  });

  const frontendUrl = "http://localhost:3002";
  app.enableCors({
    origin: [frontendUrl, "https://zot.so", "https://app.zot.so"],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3010);
}

void bootstrap();
