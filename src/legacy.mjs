const productPaths = new Map([
  ["1800327", "/urun/bosch-condens-2000-kombi-karti/"],
  ["1800289", "/urun/arcelik-dgk-20h-kombi-karti/"],
  ["1800290", "/urun/arcelik-dgk-20-bi-kombi-karti/"],
  ["1800294", "/urun/arcelik-dgk-20-hermatik-kombi-karti/"],
  ["1800295", "/urun/arcelik-dgk-20-h-lcd-kombi-karti/"],
  ["1800296", "/urun/arcelik-dgk-y-28-kombi-karti/"],
]);

export function legacyDestination(url) {
  if (url.pathname !== "/" || !url.search) return undefined;
  const product = productPaths.get(url.searchParams.get("Id"));
  if (product) return product;
  if (url.searchParams.get("pnum") === "63") return "/yedek-parcalar/uc-yollu-vanalar/";
  return undefined;
}
