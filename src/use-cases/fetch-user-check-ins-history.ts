import type { CheckIn } from "generated/prisma/client.js";
import type { CheckInsRepository } from "@/repositories/check-ins-repository.js";

interface FetchUserCheckInsUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsUseCaseRequest): Promise<FetchUserCheckInsUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    );

    return {
      checkIns,
    };
  }
}
