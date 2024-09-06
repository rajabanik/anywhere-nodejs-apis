import { Request, Response } from "express";
import { ZodError } from "zod";
import { flightSchema } from "../../schemas/flights/flightSchema";
import { getAmadeusFlightOffers } from "../../services/wrappers/flightWrapperService";

export const getFlightOffers = async (req: Request, res: Response): Promise<Response> => {
    try {
        flightSchema.parse(req.body);

        const { originLocationCode, destinationLocationCode, departureDate, adults, nonStop, max, currencyCode } = req.body;

        const flightOffers = await getAmadeusFlightOffers(originLocationCode, destinationLocationCode, departureDate, adults, nonStop, max, currencyCode);

        if (!flightOffers || !flightOffers.data) {
            return res.status(400).json({
                message: "Failed to fetch flight offers",
                error: "No data received from flight offers service",
                status: 400
            });
        }

        const parsedFlightOffersResponse = flightOffers.data.map((offer: any) => ({
            oneWay: offer.oneWay || false,
            lastTicketingDate: offer.lastTicketingDate || new Date().toISOString().split('T')[0],
            lastTicketingDateTime: offer.lastTicketingDateTime || new Date().toISOString(),
            segments: Array.isArray(offer.itineraries[0].segments) ? offer.itineraries[0].segments.map((segment: any, segIndex: number) => ({
                departure: segment.departure,
                arrival: segment.arrival,
                carrierCode: segment.carrierCode,
                number: segment.number,
                aircraft: segment.aircraft,
                operating: segment.operating,
                duration: segment.duration,
                id: segIndex.toString(),
                numberOfStops: segment.numberOfStops || 0,
                blacklistedInEU: segment.blacklistedInEU || false
            })) : [],
            price: {
                currency: offer.price.currency || 'INR',
                total: offer.price.total || '0.00',
                base: offer.price.base || '0.00',
                fees: offer.price.fees || [],
                grandTotal: offer.price.grandTotal || '0.00'
            }
        }));

        const dictionaries = flightOffers.dictionaries || {
            locations: {},
            aircraft: {},
            currencies: {},
            carriers: {}
        };

        return res.status(200).json({
            message: "Flight offers fetched successfully",
            data: parsedFlightOffersResponse,
            dictionaries: dictionaries,
            status: 200
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors,
                status: 400
            });
        } else {
            return res.status(400).json({
                message: "Failed to fetch flight offers",
                error: "An unexpected error occurred",
                status: 400
            });
        }
    }
};
