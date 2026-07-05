import type { Gym } from "generated/prisma/browser.js";

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
}
