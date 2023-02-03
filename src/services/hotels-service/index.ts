import { notFoundError, paymentRequiredError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hotel } from "@prisma/client";

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

const hotelsService = {
  getHotels,
};

export default hotelsService;
