import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: faker.datatype.number({ min: 1 }),
      hotelId,
    },
  });
}
