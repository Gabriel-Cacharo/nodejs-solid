import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym.js";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "Academia São Paulo",
      description: "Academia top",
      latitude: "500.0",
      longitude: "500.0",
      phone: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
