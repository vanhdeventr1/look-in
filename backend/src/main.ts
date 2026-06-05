import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { Handler } from "./cores/exceptions/handler.exception";
import { Response } from "./cores/interceptions/response.interception";
import express = require("express");

const getAllowedOrigins = () => {
  const configured = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
    process.env.CORS_ORIGINS,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return configured.length > 0
    ? configured
    : ["http://localhost:5173", "http://localhost:4173"];
};

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  paths: string[];
}) => {
  return (req: any, res: any, next: any) => {
    if (!options.paths.some((path) => req.path.startsWith(path))) {
      next();
      return;
    }

    const now = Date.now();
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      "unknown";
    const key = `${ip}:${req.method}:${req.path}`;
    const current = rateLimitStore.get(key);

    if (!current || current.resetAt <= now) {
      rateLimitStore.set(key, { count: 1, resetAt: now + options.windowMs });
      next();
      return;
    }

    if (current.count >= options.max) {
      res.status(429).json({
        statusCode: 429,
        message: "Too many requests, please try again later",
      });
      return;
    }

    current.count += 1;
    next();
  };
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set("query parser", "extended");
  const httpAdapter = app.get(HttpAdapterHost);
  const allowedOrigins = getAllowedOrigins();

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  });
  app.use(
    createRateLimiter({
      windowMs: 60 * 1000,
      max: 20,
      paths: [
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/attendances/check-in",
        "/api/v1/attendances/quick-check-in",
      ],
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.useGlobalFilters(new Handler(httpAdapter));
  app.useGlobalInterceptors(new Response());

  await app.listen(3000, "0.0.0.0");
}
bootstrap();
