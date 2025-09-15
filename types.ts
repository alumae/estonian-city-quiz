export interface City {
  id: number;
  name: string;
  coords: { lat: number; lng: number };
}

export type CountryCode = 'ee' | 'ua';

export interface MapConfig {
  center: [number, number];
  zoom: number;
}

export interface Country {
  name: string;
  cities: City[];
  mapConfig: MapConfig;
}