import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.js";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error.js";
import { AuthenticateUseCase } from "@/use-cases/authenticate.js";

export async function authenticateController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(req.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository);

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(200).send();
}
