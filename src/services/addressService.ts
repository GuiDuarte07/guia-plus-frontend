import axios from "axios";
import { ReverseGeocodeResponse } from "../interfaces/reverseGeoCode";

const API_BASE_URL = "https://nominatim.openstreetmap.org";

export const reverseGeocode = async (lat: number, lon: number) => {
  try {
    const response = await axios.get<ReverseGeocodeResponse>(
      `${API_BASE_URL}/reverse`,
      {
        params: {
          format: "json",
          lat,
          lon,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    throw error;
  }
};
