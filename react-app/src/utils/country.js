// utils/country.js
export const COUNTRY_MAP = {
  IN: "India",
  LK: "Sri Lanka",
  US: "United States",
  UK: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  BN: "Bangladesh",
  PK: "Pakistan"
};

export const getCountryName = (code) =>
  COUNTRY_MAP[code] || "Country";
