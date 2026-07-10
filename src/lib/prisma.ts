import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { env } from "../env/index.js";

// O driver pg ignora o parâmetro "?schema=" da URL (só o Prisma CLI entende),
// então o schema precisa ser passado explicitamente para o adapter
const schema =
  new URL(env.DATABASE_URL).searchParams.get("schema") ?? undefined;

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL }, { schema });

export const prisma = new PrismaClient({ adapter });
