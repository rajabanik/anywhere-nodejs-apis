import dotenv from "dotenv";
import { getAmadeusAccessToken } from "../../auth/amadeusAuth";

dotenv.config();

const AMADEUS_API_BASE_URL = process.env.AMADEUS_API_BASE_URL || "";

export const getAmadeusFlightOffers = async (
    originLocationCode: string,
    destinationLocationCode: string,
    departureDate: string,
    adults: number,
    nonStop: boolean = false,
    max: number,
    currencyCode: string = "INR"
) => {
    const REQ_URL = `${AMADEUS_API_BASE_URL}/v2/shopping/flight-offers`;
    const params = new URLSearchParams({
        originLocationCode: originLocationCode,
        destinationLocationCode: destinationLocationCode,
        departureDate: departureDate,
        adults: String(adults),
        nonStop: String(nonStop),
        max: String(max),
        currencyCode: currencyCode
    });

    try {
        const accessToken = await getAmadeusAccessToken();
        const response = await fetch(`${REQ_URL}?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
