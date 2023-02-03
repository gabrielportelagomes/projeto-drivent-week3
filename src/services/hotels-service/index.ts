import { notFoundError, paymentRequiredError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hotel, Room } from "@prisma/client";

async function getHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.status !== "PAID") {
    throw paymentRequiredError("You must have paid the ticket to continue");
  }

  if (ticket.TicketType.isRemote) {
    throw paymentRequiredError("You must have a non-remote ticket to continue");
  }

  if (!ticket.TicketType.includesHotel) {
    throw paymentRequiredError("You must have a hotel-included ticket to continue");
  }

  const hotels = await hotelsRepository.findHotels();

  if (!hotels) {
    throw notFoundError();
  }

  return hotels;
}

async function getRoomsByHotel(userId: number, hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.status !== "PAID") {
    throw paymentRequiredError("You must have paid the ticket to continue");
  }

  if (ticket.TicketType.isRemote) {
    throw paymentRequiredError("You must have a non-remote ticket to continue");
  }

  if (!ticket.TicketType.includesHotel) {
    throw paymentRequiredError("You must have a hotel-included ticket to continue");
  }

  const hotel = await hotelsRepository.findHotelById(hotelId);

  if (!hotel) {
    throw notFoundError();
  }

  const hotelRooms = await hotelsRepository.findRoomsHotelById(hotelId);

  if (!hotelRooms) {
    throw notFoundError();
  }

  return hotelRooms;
}

const hotelsService = {
  getHotels,
  getRoomsByHotel,
};

export default hotelsService;
