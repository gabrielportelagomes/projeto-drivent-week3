import { Router } from "express";
import { authenticateToken, validateParams } from "@/middlewares";
import { getHotels, getRoomsByHotel } from "@/controllers";
import { hotelIdParamSchema } from "@/schemas";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", validateParams(hotelIdParamSchema), getRoomsByHotel);

export { hotelsRouter };
