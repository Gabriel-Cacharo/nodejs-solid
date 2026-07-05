import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { CheckInUseCase } from "./check-in.js";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { Decimal } from "@prisma/client/runtime/client";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;
let gymsRepository: InMemoryGymsRepository;

describe("CheckIn Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-01",
      title: "Academia São Paulo",
      description: "",
      phone: "",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2026, 0, 4, 8, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to check in twice in but in different days", async () => {
    vi.setSystemTime(new Date(2026, 0, 4, 8, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2026, 0, 5, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
