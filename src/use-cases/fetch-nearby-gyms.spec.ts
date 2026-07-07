import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyUseCase } from "./fetch-nearby-gyms.js";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Academia São Paulo",
      description: "Academia top",
      latitude: "500.0",
      longitude: "500.0",
      phone: null,
    });

    await gymsRepository.create({
      title: "Academia Ribeirão Preto",
      description: "Academia top",
      latitude: "2000000.0",
      longitude: "2000000.0",
      phone: null,
    });

    const { gyms } = await sut.execute({
      userLatitude: 500,
      userLongitude: 500,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Academia São Paulo" }),
    ]);
  });
});
