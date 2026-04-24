import { Mastra } from "@mastra/core/mastra";
import { registerApiRoute } from "@mastra/core/server";
import { VercelDeployer } from "@mastra/deployer-vercel";
import { reviewSentimentAgent } from "./agents/reviewSentimentAgent.ts";
import { reviewSentimentHandler } from "./apiRoutes/reviewSentiment.ts";

export const mastra = new Mastra({
  deployer: new VercelDeployer(),
  agents: { reviewSentimentAgent },
  server: {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://260427-css-custom-highlight-04-heat-rust.vercel.app",
      ],
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type"],
      credentials: false,
    },
    apiRoutes: [
      registerApiRoute("/review-sentiment", {
        method: "POST",
        handler: reviewSentimentHandler,
      }),
    ],
  },
});
