import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, rawBody: true });

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
    .setContact("Zot Team", "https://zot.dev", "support@zot.dev")
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

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

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

  app.enableCors({
    origin: "https://zot.dev",
  });

  await app.listen(process.env.PORT ?? 3010);
}

void bootstrap();
