import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

async function findHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany({});
}

async function findHotelById(id: number): Promise<Hotel> {
  return prisma.hotel.findUnique({
    where: { id },
  });
}

async function findRoomsHotelById(id: number): Promise<Hotel & { Rooms: Room[] }> {
  return prisma.hotel.findUnique({
    where: { id },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  findHotels,
  findHotelById,
  findRoomsHotelById,
};

export default hotelsRepository;
