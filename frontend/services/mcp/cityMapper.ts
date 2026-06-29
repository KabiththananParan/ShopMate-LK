export function normalizeCity(city: string): string {
  const normalized = city.toLowerCase().trim();

  const CITY_MAP: Record<string, string> = {
    colombo: "Colombo 03",
    jaffna: "Jaffna",
    kandy: "Kandy",
    galle: "Galle",
    matara: "Matara",
    negombo: "Negombo",
    dehiwala: "Dehiwala",
    "mount lavinia": "Mount Lavinia",
    nugegoda: "Nugegoda",
  };

  return CITY_MAP[normalized] ?? city;
}