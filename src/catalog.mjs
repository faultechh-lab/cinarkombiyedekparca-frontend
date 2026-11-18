const defaultOrigin = "https://www.cinarkombiyedekparca.com";
export const origin = (
  typeof process !== "undefined" ? (process.env.SITE_ORIGIN || defaultOrigin) : defaultOrigin
).replace(/\/$/, "");
export const phone = "+905347453469";
export const phoneLabel = "0534 745 34 69";
export const address = "Ufuk Mahallesi, Seyfi Demirsoy Caddesi No: 58/A";
const placeId = "ChIJbyg03C_ZuxQRE3kd6zsg3Oo";
const placeQuery = encodeURIComponent(`Çınar Ticaret, ${address}, Buca, İzmir`);
export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${placeQuery}&query_place_id=${placeId}`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${placeQuery}&destination_place_id=${placeId}`;
export const whatsapp = "https://wa.me/905347453469";

export function messageLink(message) {
  return `${whatsapp}?text=${encodeURIComponent(message)}`;
}
