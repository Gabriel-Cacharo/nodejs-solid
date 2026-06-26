import { registerController } from "./controllers/register.controller.js";
import type { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", registerController);
}
