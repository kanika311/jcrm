/**
 * Utility to format phone numbers, especially Indian numbers,
 * ensuring standard display (+91 XXXXXXXXXX) and valid WhatsApp links (https://wa.me/91XXXXXXXXXX).
 */
export function formatIndianPhone(rawPhone?: string | null): { display: string; waLink: string } {
  if (!rawPhone) return { display: "—", waLink: "" };
  const clean = String(rawPhone).trim();
  if (!clean) return { display: "—", waLink: "" };

  const digits = clean.replace(/\D/g, "");

  let formattedDisplay = clean;
  let waDigits = digits;

  if (digits.length === 10) {
    formattedDisplay = `+91 ${digits}`;
    waDigits = `91${digits}`;
  } else if (digits.length === 11 && digits.startsWith("0")) {
    const ten = digits.slice(1);
    formattedDisplay = `+91 ${ten}`;
    waDigits = `91${ten}`;
  } else if (digits.length === 12 && digits.startsWith("91")) {
    const ten = digits.slice(2);
    formattedDisplay = `+91 ${ten}`;
    waDigits = digits;
  } else if (clean.startsWith("+")) {
    const withoutPlus = clean.replace(/^\+/, "").replace(/\s+/g, "");
    if (withoutPlus.startsWith("91") && withoutPlus.length === 12) {
      formattedDisplay = `+91 ${withoutPlus.slice(2)}`;
    } else {
      formattedDisplay = clean;
    }
    waDigits = digits;
  } else if (digits.length > 0) {
    formattedDisplay = `+91 ${digits}`;
    waDigits = `91${digits}`;
  }

  return {
    display: formattedDisplay,
    waLink: waDigits ? `https://wa.me/${waDigits}` : "",
  };
}
