import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymsUseCase } from "./search-gyms.js";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms History Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
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
      latitude: "500.0",
      longitude: "500.0",
      phone: null,
    });

    const { gyms } = await sut.execute({
      query: "Ribeirão",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Academia Ribeirão Preto" }),
    ]);
  });
});
