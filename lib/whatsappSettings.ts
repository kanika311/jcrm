import { prisma } from "@/lib/prisma";

export interface WhatsAppConfig {
  whatsappNumber: string;
  buttonText: string;
  defaultMessage: string;
  isEnabled: boolean;
  supportTitle: string;
  supportSubtitle: string;
}

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppConfig = {
  whatsappNumber: "918310531309",
  buttonText: "Course Enquiry",
  defaultMessage: "Hello JCRM Technologies, I want to enquire about course details, fees, and admissions.",
  isEnabled: true,
  supportTitle: "JCRM Support & Admissions",
  supportSubtitle: "Online • Typically replies instantly",
};

/**
 * Normalizes phone number to digits only with country code
 * e.g., "+91 83105-31309" -> "918310531309"
 */
export function cleanWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "");
  // If user enters 10-digit Indian number without country code, prefix 91
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned || "918310531309";
}

export async function getWhatsAppSettings(): Promise<WhatsAppConfig> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "whatsapp-settings" },
    });

    if (!record || !record.content) {
      return DEFAULT_WHATSAPP_CONFIG;
    }

    const content = record.content as any;
    return {
      whatsappNumber: content.whatsappNumber ? cleanWhatsAppNumber(content.whatsappNumber) : DEFAULT_WHATSAPP_CONFIG.whatsappNumber,
      buttonText: content.buttonText || DEFAULT_WHATSAPP_CONFIG.buttonText,
      defaultMessage: content.defaultMessage || DEFAULT_WHATSAPP_CONFIG.defaultMessage,
      isEnabled: content.isEnabled !== undefined ? Boolean(content.isEnabled) : DEFAULT_WHATSAPP_CONFIG.isEnabled,
      supportTitle: content.supportTitle || DEFAULT_WHATSAPP_CONFIG.supportTitle,
      supportSubtitle: content.supportSubtitle || DEFAULT_WHATSAPP_CONFIG.supportSubtitle,
    };
  } catch (error) {
    console.error("Error fetching WhatsApp settings from Prisma:", error);
    return DEFAULT_WHATSAPP_CONFIG;
  }
}

export async function saveWhatsAppSettings(data: Partial<WhatsAppConfig>): Promise<WhatsAppConfig> {
  const current = await getWhatsAppSettings();
  const updated: WhatsAppConfig = {
    whatsappNumber: data.whatsappNumber ? cleanWhatsAppNumber(data.whatsappNumber) : current.whatsappNumber,
    buttonText: (data.buttonText !== undefined && data.buttonText.trim()) ? data.buttonText.trim() : current.buttonText,
    defaultMessage: (data.defaultMessage !== undefined && data.defaultMessage.trim()) ? data.defaultMessage.trim() : current.defaultMessage,
    isEnabled: data.isEnabled !== undefined ? Boolean(data.isEnabled) : current.isEnabled,
    supportTitle: data.supportTitle || current.supportTitle,
    supportSubtitle: data.supportSubtitle || current.supportSubtitle,
  };

  await prisma.siteContent.upsert({
    where: { pageId: "whatsapp-settings" },
    create: {
      pageId: "whatsapp-settings",
      category: "global",
      content: updated as any,
    },
    update: {
      content: updated as any,
    },
  });

  return updated;
}
