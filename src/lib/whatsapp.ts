export function toWhatsAppLink(number: string, message?: string | null): string {
  const sanitized = number.replace(/[^\d]/g, "");
  const encoded = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${sanitized}${encoded}`;
}

export function buildItemWhatsAppMessage(itemName: string, custom?: string | null): string {
  if (custom && custom.trim()) {
    return custom.trim().replaceAll("{item_name}", itemName);
  }
  return `Hello, I found your store on Byroo and I want to order ${itemName}.`;
}

export function buildServiceWhatsAppMessage(serviceName: string, custom?: string | null): string {
  if (custom && custom.trim()) {
    return custom.trim().replaceAll("{service_name}", serviceName);
  }
  return `Hello, I want to inquire about ${serviceName}.`;
}
