import { authenticateController } from "./controllers/authenticate.controller.js";
import { profileController } from "./controllers/profile.controller.js";
import { registerController } from "./controllers/register.controller.js";
import type { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", registerController);
  app.post("/sessions", authenticateController);

  // Authenticated
  app.get("/me", profileController);
}
