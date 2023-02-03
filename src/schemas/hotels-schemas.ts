import { HotelIdParam } from "@/protocols";
import Joi from "joi";

export const hotelIdParamSchema = Joi.object<HotelIdParam>({
  hotelId: Joi.number().integer().required(),
});
