import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository.js";
import { FetchUserCheckInsUseCase } from "../fetch-user-check-ins-history.js";

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsUseCase(checkInsRepository);

  return useCase;
}
