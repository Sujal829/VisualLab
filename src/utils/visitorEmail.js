import emailjs from "@emailjs/browser";
import { UAParser } from "ua-parser-js";

export const sendDetails = async (googleUser) => {
  if (sessionStorage.getItem("visitorSent")) return;

  const parser = new UAParser();
  const result = parser.getResult();

  // Helper to get landing page
  let landingPage = localStorage.getItem("landingPage");
  if (!landingPage) {
    landingPage = window.location.href;
    localStorage.setItem("landingPage", landingPage);
  }

  // Session ID
  let sessionId = sessionStorage.getItem("visitorSessionId");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("visitorSessionId", sessionId);
  }

  // First Visit Check
  let firstVisit = localStorage.getItem("firstVisitTime");
  const isReturning = !!firstVisit;
  if (!firstVisit) {
    firstVisit = new Date().toLocaleString();
    localStorage.setItem("firstVisitTime", firstVisit);
  }

  let locationData = {};
  try {
    const res = await fetch("https://ipapi.co/json/");
    locationData = await res.json();
  } catch {
    // console.log("Location fetch failed");
  }

  // Battery Info
  let batteryInfo = { level: "N/A", charging: "N/A" };
  try {
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      batteryInfo.level = `${Math.round(battery.level * 100)}%`;
      batteryInfo.charging = battery.charging ? "Yes" : "No";
    }
  } catch {
     // console.error("Battery info fetch failed");
  }

  const templateParams = {
    // GOOGLE ACCOUNT INFORMATION
    name: googleUser?.name || "Portfolio Visitor",
    given_name: googleUser?.given_name || "Unknown",
    family_name: googleUser?.family_name || "Unknown",
    email: googleUser?.email || "Unknown",
    email_verified: googleUser?.email_verified ? "Yes" : "No",
    google_id: googleUser?.sub || "Unknown",
    picture: googleUser?.picture || "",
    issuer: googleUser?.iss || "Unknown",
    audience: googleUser?.aud || "Unknown",

    // VISIT INFORMATION
    visit_time: new Date().toLocaleString(),
    session_id: sessionId,
    page_url: window.location.href,
    page_title: document.title,
    referrer: document.referrer || "Direct",
    landing_page: landingPage,

    // LOCATION INFORMATION
    ip: locationData.ip || "Unknown",
    city: locationData.city || "Unknown",
    region: locationData.region || "Unknown",
    country: locationData.country_name || "Unknown",
    postal_code: locationData.postal || "Unknown",
    latitude: locationData.latitude || "Unknown",
    longitude: locationData.longitude || "Unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isp: locationData.org || "Unknown",
    organization: locationData.org || "Unknown",
    asn: locationData.asn || "Unknown",

    // DEVICE INFORMATION
    device_type: result.device.type || "desktop",
    device_vendor: result.device.vendor || "unknown",
    device_model: result.device.model || "unknown",
    platform: navigator.platform,
    cpu_architecture: result.cpu.architecture || "unknown",
    cpu_cores: navigator.hardwareConcurrency || "unknown",
    device_memory: navigator.deviceMemory || "unknown",
    touch_support: ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? "Yes" : "No",
    max_touch_points: navigator.maxTouchPoints || 0,

    // OPERATING SYSTEM
    os_name: result.os.name || "unknown",
    os_version: result.os.version || "unknown",
    architecture: result.cpu.architecture || "unknown",

    // BROWSER INFORMATION
    browser_name: result.browser.name || "unknown",
    browser_version: result.browser.version || "unknown",
    user_agent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages ? navigator.languages.join(", ") : navigator.language,
    cookies_enabled: navigator.cookieEnabled ? "Yes" : "No",
    online_status: navigator.onLine ? "Online" : "Offline",
    do_not_track: navigator.doNotTrack || "unspecified",

    // DISPLAY INFORMATION
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    avail_width: window.screen.availWidth,
    avail_height: window.screen.availHeight,
    color_depth: window.screen.colorDepth,
    pixel_depth: window.screen.pixelDepth,
    device_pixel_ratio: window.devicePixelRatio,
    orientation: screen.orientation?.type || "unknown",

    // HARDWARE & PERFORMANCE
    network_type: navigator.connection?.effectiveType || "unknown",
    network_downlink: navigator.connection?.downlink ? `${navigator.connection.downlink} Mbps` : "unknown",
    network_rtt: navigator.connection?.rtt ? `${navigator.connection.rtt} ms` : "unknown",
    battery_level: batteryInfo.level,
    battery_charging: batteryInfo.charging,

    // USER ACTIVITY
    time_on_page: "Calculating...", // This would require periodic updates
    pages_viewed: 1, // Simple count if needed
    scroll_depth: "0%", // Dynamic
    mouse_clicks: 0, // Dynamic
    first_visit: firstVisit,
    returning_visitor: isReturning ? "Yes" : "No",

    // SECURITY INFORMATION
    https_enabled: window.location.protocol === "https:" ? "Yes" : "No",
    cookie_consent: "Implicit",
    adblock_detected: "Unknown", // Requires specific detection logic
  };

  emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_EMAIL_TEMPLATE_ID,
    templateParams,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  ).then(
    () => {
      sessionStorage.setItem("visitorSent", "true");
    },
    (error) => {
       console.error("FAILED to send visitor email...", error);
    }
  );
};
