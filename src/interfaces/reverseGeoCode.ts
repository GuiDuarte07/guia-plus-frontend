export interface Address {
  house_number?: string;
  road?: string;
  suburb?: string;
  city?: string;
  municipality?: string;
  county?: string;
  state_district?: string;
  state?: string;
  region?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  town?: string;
}

export interface ReverseGeocodeResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: Address;
  boundingbox: string[];
}
