import { Router } from "express";
import { getFlightOffers } from "../../controllers/flights/flightController";

const flightRouter = Router();

flightRouter.post("/wrappers/get-flight-offers", getFlightOffers);

export default flightRouter;