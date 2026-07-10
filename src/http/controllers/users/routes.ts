import { verifyJWT } from "@/http/middlewares/verify-jwt.js";
import { authenticateController } from "./authenticate.controller.js";
import { profileController } from "./profile.controller.js";
import { registerController } from "./register.controller.js";
import type { FastifyInstance } from "fastify";
import { refresh } from "./refresh.controller.js";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", registerController);
  app.post("/sessions", authenticateController);

  app.patch("/token/refresh", refresh);

  // Authenticated
  app.get("/me", { onRequest: [verifyJWT] }, profileController);
}
