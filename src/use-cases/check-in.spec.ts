import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { CheckInUseCase } from "./check-in.js";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { Decimal } from "@prisma/client/runtime/client";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins.-error.js";
import { MaxDistanceError } from "./errors/max-distance-error.js";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;
let gymsRepository: InMemoryGymsRepository;

describe("CheckIn Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Academia São Paulo",
      description: "",
      phone: "",
      latitude: new Decimal(500),
      longitude: new Decimal(500),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-01",
      userLatitude: 500,
      userLongitude: 500,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2026, 0, 4, 8, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-01",
      userLatitude: 500,
      userLongitude: 500,
    });

    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: "gym-01",
        userLatitude: 500,
        userLongitude: 500,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should not be able to check in twice in but in different days", async () => {
    vi.setSystemTime(new Date(2026, 0, 4, 8, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-01",
      userLatitude: 500,
      userLongitude: 500,
    });

    vi.setSystemTime(new Date(2026, 0, 5, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-01",
      userLatitude: 500,
      userLongitude: 500,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Academia Javascript",
      description: "",
      phone: "",
      latitude: new Decimal(500),
      longitude: new Decimal(500),
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-02",
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
