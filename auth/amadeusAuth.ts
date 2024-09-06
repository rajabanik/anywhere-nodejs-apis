import dotenv from "dotenv";

dotenv.config();

const AMADEUS_API_BASE_URL = process.env.AMADEUS_API_BASE_URL || "";

export const getAmadeusAccessToken = async (): Promise<string> => {
    const REQ_URL = AMADEUS_API_BASE_URL + "/v1/security/oauth2/token";
    try {
        const response = await fetch(REQ_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                "grant_type": "client_credentials",
                "client_id": process.env.AMADEUS_API_KEY || "",
                "client_secret": process.env.AMADEUS_API_SECRET || ""
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to get token: ${response.status}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        throw error;
    }
};