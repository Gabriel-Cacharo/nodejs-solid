import type { FastifyRequest, FastifyReply } from "fastify";

export async function profileController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  await req.jwtVerify();

  return reply.status(200).send();
}
