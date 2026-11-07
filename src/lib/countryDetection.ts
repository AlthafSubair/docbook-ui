import { getCountries, type CountryCode } from "libphonenumber-js";

// Mapping of common IANA timezones to ISO country codes
const TIMEZONE_TO_COUNTRY: Record<string, CountryCode> = {
  // India & South Asia
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Dhaka": "BD",
  "Asia/Karachi": "PK",
  "Asia/Colombo": "LK",
  "Asia/Kathmandu": "NP",

  // Middle East / GCC
  "Asia/Dubai": "AE",
  "Asia/Riyadh": "SA",
  "Asia/Qatar": "QA",
  "Asia/Doha": "QA",
  "Asia/Kuwait": "KW",
  "Asia/Muscat": "OM",
  "Asia/Bahrain": "BH",
  "Asia/Amman": "JO",
  "Asia/Beirut": "LB",

  // North America
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Phoenix": "US",
  "America/Anchorage": "US",
  "America/Detroit": "US",
  "America/Indianapolis": "US",
  "Pacific/Honolulu": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Montreal": "CA",
  "America/Edmonton": "CA",
  "America/Winnipeg": "CA",
  "America/Halifax": "CA",
  "America/St_Johns": "CA",
  "America/Mexico_City": "MX",

  // Europe
  "Europe/London": "GB",
  "Europe/Dublin": "IE",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Rome": "IT",
  "Europe/Madrid": "ES",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Vienna": "AT",
  "Europe/Zurich": "CH",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Helsinki": "FI",
  "Europe/Warsaw": "PL",
  "Europe/Prague": "CZ",
  "Europe/Budapest": "HU",
  "Europe/Athens": "GR",
  "Europe/Lisbon": "PT",
  "Europe/Bucharest": "RO",
  "Europe/Sofia": "BG",
  "Europe/Istanbul": "TR",

  // Asia Pacific
  "Asia/Singapore": "SG",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Hong_Kong": "HK",
  "Asia/Taipei": "TW",
  "Asia/Bangkok": "TH",
  "Asia/Jakarta": "ID",
  "Asia/Manila": "PH",
  "Asia/Ho_Chi_Minh": "VN",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Perth": "AU",
  "Australia/Adelaide": "AU",
  "Australia/Hobart": "AU",
  "Australia/Darwin": "AU",
  "Pacific/Auckland": "NZ",

  // South America
  "America/Sao_Paulo": "BR",
  "America/Buenos_Aires": "AR",
  "America/Santiago": "CL",
  "America/Bogota": "CO",
  "America/Lima": "PE",

  // Africa
  "Africa/Cairo": "EG",
  "Africa/Johannesburg": "ZA",
  "Africa/Nairobi": "KE",
  "Africa/Lagos": "NG",
  "Africa/Casablanca": "MA",
};

let validCountriesSet: Set<string> | null = null;
let lastLoggedResolution: string | null = null;

function isValidCountryCode(code: string): code is CountryCode {
  if (!validCountriesSet) {
    validCountriesSet = new Set(getCountries());
  }
  return validCountriesSet.has(code.toUpperCase());
}

/**
 * Logs the detected country and its source in development mode.
 */
function logResolution(country: CountryCode, source: string) {
  if (process.env.NODE_ENV === "development") {
    const key = `${country}:${source}`;
    if (lastLoggedResolution !== key) {
      lastLoggedResolution = key;
      console.log(`[countryDetection] Default country resolved: "${country}" (source: ${source})`);
    }
  }
}

/**
 * Fast synchronous detection using localStorage and device timezone.
 * Runs instantly on the client without network requests.
 * Note: Browser language (navigator.language) is intentionally omitted because users worldwide
 * frequently select English (e.g. "en-US", "en-GB") as their UI language regardless of their residence.
 */
export function getClientLocalCountry(): CountryCode | null {
  if (typeof window === "undefined") return null;

  // 1. Saved country from previous visit/selection
  try {
    const saved = localStorage.getItem("docbook_user_country");
    if (saved && isValidCountryCode(saved)) {
      const country = saved.toUpperCase() as CountryCode;
      logResolution(country, 'localStorage "docbook_user_country"');
      return country;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[countryDetection] Failed reading docbook_user_country from localStorage:", error);
    }
  }

  // 2. Browser Timezone mapping (tied to device clock/geography, not UI language)
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && TIMEZONE_TO_COUNTRY[timeZone]) {
      const country = TIMEZONE_TO_COUNTRY[timeZone];
      logResolution(country, `browser timezone "${timeZone}"`);
      return country;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[countryDetection] Timezone detection error:", error);
    }
  }

  return null;
}

/**
 * Detects user country dynamically:
 * 1. Checks local detection (user storage preference, device timezone) first for instant results.
 * 2. Asynchronously queries geo-IP service to refine/confirm the physical country location.
 */
export async function detectUserCountry(fallback: CountryCode = "IN"): Promise<CountryCode> {
  const localDetected = getClientLocalCountry();
  if (localDetected) {
    return localDetected;
  }

  // If local detection didn't match, attempt a quick geo-IP lookup with timeout
  if (typeof window !== "undefined") {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch("https://api.country.is", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const code = data?.country?.toUpperCase();
        if (code && isValidCountryCode(code)) {
          const country = code as CountryCode;
          logResolution(country, 'Geo-IP lookup "https://api.country.is"');
          try {
            localStorage.setItem("docbook_user_country", country);
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.debug("[countryDetection] Failed saving detected country to localStorage:", error);
            }
          }
          return country;
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[countryDetection] Geo-IP lookup failed or timed out:", error);
      }
    }
  }

  logResolution(fallback, "fallback default");
  return fallback;
}
