import { address, directionsUrl, mapUrl, messageLink, origin, phone, phoneLabel, whatsapp } from "./catalog.mjs";
import { adminPath, loginPath } from "./auth-client.mjs";

const shopName = "Çınar Ticaret";
const repairPath = "/kombi-kart-tamiri/";
export const catalogPath = "/yedek-parcalar/";
const aboutPath = "/hakkimizda/";
const contactPath = "/iletisim/";
const contactEmails = ["m.furkanikizler@gmail.com", "cinarkombiyedekparcakarttamiri@gmail.com"];
const repairPhoto = (loading) => `<img class="repair-photo" src="/assets/kombi-kart-tamiri.jpg" alt="Kombi kontrol kartını multimetreyle test eden teknisyen" width="960" height="640" loading="${loading}" decoding="async">`;
const mapEmbedUrl = `https://www.google.com/maps?output=embed&hl=tr&z=17&q=${encodeURIComponent(`${shopName}, ${address}, Buca, İzmir`)}`;
const storefront = {
  image: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RjhaslyHgrEcxVBxSFQjTPIAkxH2lt2aZekD44ng_gpg35ivJpPUtaLh6sBZwGbZjuJqxUh0URtjlxaetTTb-zsT5Vl_PdKikDb1N1ZyMXRfAq6GK38PRem1xQCrM4PvsH_qw1=w390-h278-n-k-no",
  source: "https://maps.app.goo.gl/EXCcFgnA5JJ1UA6z5",
};
const reviews = [
  {
    author: "İshak Taşcıgil",
    quote: "Alışveriş yaptım kombi servisiyim aradığımı buluyorum işini biliyor uzman.",
    source: "https://maps.app.goo.gl/E2S5yXbL3PCjgHKs6",
  },
  {
    author: "Sinan Teknik",
    quote: "… gerek esnaflığı gerek bilgisi tecrübesi izmirde tek olduğunu düşünüyorum …",
    source: "https://maps.app.goo.gl/23ihsAyKdPBXoWU39",
  },
];
export const categoryPath = (category) => `${catalogPath}${encodeURIComponent(category.slug)}/`;
export const productPath = (product) => `/urun/${encodeURIComponent(product.slug)}/`;
const escape = (value) => String(value).replace(/[&<>"']/g, (symbol) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[symbol]);
const json = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${origin}/#isletme`,
  name: "Çınar Ticaret kombi yedek parça ve kombi kart tamiri",
  url: `${origin}/`,
  telephone: phone,
  address: {
    "@type": "PostalAddress", streetAddress: address, addressLocality: "Buca",
    addressRegion: "İzmir", addressCountry: "TR",
  },
  hasMap: mapUrl,
};
const whatsappButton = (href = whatsapp, label = "WhatsApp") =>
  `<a class="button button-outline whatsapp" href="${escape(href)}"><img src="/assets/whatsapp.png" alt="" width="22" height="22">${label}</a>`;
const logo = `<a class="brand" href="/" aria-label="Çınar Ticaret ana sayfa">
  <img src="/assets/cinar-mark.png" alt="" width="55" height="53">
  <span class="brand-text">Çınar Ticaret <small>Kombi yedek parça ve kart tamiri</small></span>
</a>`;
const pageLinks = [
  [catalogPath, "Yedek Parçalar"], [repairPath, "Kart Tamiri"], [aboutPath, "Hakkımızda"], [contactPath, "İletişim"],
];

function page({ path, title, description, body, schema, noindex = false, standalone = false }) {
  const canonical = `${origin}${path}`;
  const menuLinks = pageLinks.map(([url, label]) => `<a href="${url}"${url === path ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">
  ${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${origin}/assets/hero.jpg">
  <meta name="theme-color" content="#0a193c">
  <link rel="icon" href="/assets/cinar-favicon-green.png" type="image/png" sizes="56x56">
  <link rel="stylesheet" href="/assets/styles.css">
  ${standalone ? "" : '<script type="module" src="/assets/menu.mjs"></script>'}
  ${schema ? `<script type="application/ld+json">${json(schema)}</script>` : ""}
</head>
<body>
  ${standalone ? "" : `<a class="skip" href="#icerik">İçeriğe geç</a>
  <header class="site-header">
    <div class="container header-inner">
      ${logo}
      <nav class="header-nav" aria-label="Ana menü">${menuLinks}</nav>
      ${whatsappButton()}
      <button class="menu-toggle" type="button" aria-label="Menüyü aç" aria-controls="mobil-menu" aria-expanded="false" aria-haspopup="dialog">
        <span class="menu-icon" aria-hidden="true"></span>
      </button>
    </div>
  </header>
  <dialog class="mobile-menu" id="mobil-menu" aria-labelledby="mobil-menu-baslik">
    <div class="menu-panel">
      <div class="menu-panel-header">
        <h2 id="mobil-menu-baslik">Menü</h2>
        <form method="dialog"><button class="menu-close" type="submit" aria-label="Menüyü kapat" autofocus>×</button></form>
      </div>
      <nav aria-label="Ana menü">${menuLinks}</nav>
      ${whatsappButton()}
    </div>
  </dialog>`}
  <main id="icerik">${body}</main>
  ${standalone ? "" : `<footer class="site-footer">
    <div class="container footer-inner">
      <div><strong>${shopName}</strong><p>Kombi yedek parça ve kart tamiri</p></div>
      <address>${address}<br>Buca / İzmir · <a href="tel:${phone}">${phoneLabel}</a></address>
      <a href="${escape(mapUrl)}">Google Haritalar’da aç</a>
    </div>
  </footer>`}
</body>
</html>`;
}

function imagePath(image) {
  if (!image) return "";
  try {
    const url = new URL(image, origin);
    return [ "http:", "https:" ].includes(url.protocol) && url.pathname.startsWith("/media/")
      ? url.pathname + url.search : "";
  } catch {
    return "";
  }
}

function categoryCards(items) {
  if (items === null) return "<p>Katalog şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.</p>";
  if (!items.length) return "<p>Henüz kategori eklenmedi.</p>";

  return `<div class="category-grid">${items.map((category) => {
    const image = imagePath(category.image);
    return `<a class="category-card" href="${categoryPath(category)}">
      ${image ? `<img src="${escape(image)}" alt="" width="310" height="238" loading="lazy">` : ""}
      <span>${escape(category.name)}</span>
    </a>`;
  }).join("")}</div>`;
}

function productList(items) {
  return `<ul class="product-list">${items.map((product) => {
    const image = imagePath(product.image);
    return `<li><a href="${productPath(product)}">
      ${image ? `<img src="${escape(image)}" alt="" width="56" height="56" loading="lazy">` : ""}
      <strong>${escape(product.name)}</strong>
    </a></li>`;
  }).join("")}</ul>`;
}

function breadcrumb(items) {
  const all = [["Ana Sayfa", "/"], ...items];
  return `<nav class="breadcrumb" aria-label="Konum"><ol>${all.map(([name, url], index) =>
    `<li>${index === all.length - 1 ? `<span aria-current="page">${escape(name)}</span>` : `<a href="${url}">${escape(name)}</a>`}</li>`).join("")}</ol></nav>`;
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [["Ana Sayfa", "/"], ...items].map(([name, url], index) => ({
      "@type": "ListItem", position: index + 1, name, item: `${origin}${url}`,
    })),
  };
}

function pageIntro(items, heading, description = "") {
  return `<header class="page-intro">
    <div class="container">
      ${items.length ? breadcrumb(items) : ""}
      <h1>${escape(heading)}</h1>
      ${description ? `<p>${escape(description)}</p>` : ""}
    </div>
  </header>`;
}

export const pages = new Map();
function add(options) {
  pages.set(options.path, page(options));
}

export function renderHome(categories) {
  return page({
  path: "/",
  title: "Kombi Yedek Parça ve Kart Tamiri | Çınar Ticaret Buca İzmir",
  description: "Buca, İzmir’de Çınar Ticaret. Kombi yedek parça kategorilerini inceleyin, kart tamiri ve parça uyumluluğu için bize ulaşın.",
  schema: localBusiness,
  body: `<section class="hero" aria-labelledby="ana-baslik">
    <div class="container hero-inner">
      <div class="hero-copy"><h1 id="ana-baslik">Kombinize uygun<br>yedek parçalar</h1><p>Kombi kartları, pompalar, fan motorları ve vanalar.</p></div>
      <img class="hero-image" src="/assets/hero.jpg" width="799" height="402" alt="" fetchpriority="high">
    </div>
  </section>
  <section class="container category-section" aria-labelledby="kategori-baslik">
    <h2 id="kategori-baslik">Parça Kategorileri</h2>
    ${categoryCards(categories?.slice(0, 4) ?? null)}
    <a class="text-link" href="${catalogPath}">Tüm kategorileri incele <span aria-hidden="true">→</span></a>
  </section>
  <section class="business-section" aria-labelledby="kart-tamiri-baslik">
    <div class="container business-inner">
      <div>
        <h2 id="kart-tamiri-baslik">Kombi yedek parça ve kart tamiri</h2>
        <p>Arızalı kombi kartının tamire uygunluğunu değerlendiriyoruz. Bilgi almak için kombinizin marka ve modelini, yaşadığınız sorunu ve varsa ekrandaki hata kodunu bizimle paylaşabilirsiniz.</p>
        <a class="button button-outline" href="${repairPath}">Daha Fazla Bilgi</a>
      </div>
      ${repairPhoto("lazy")}
    </div>
  </section>
  <section class="container visit-section" aria-labelledby="ziyaret-baslik">
    <h2 id="ziyaret-baslik">Google yorumları ve konum</h2>
    <div class="visit-grid">
      <div class="visit-reviews">
        <p class="review-summary"><strong>4,7 / 5</strong><span>Google Haritalar’da 111 yorum</span></p>
        <ul class="review-list">${reviews.map((review) => `<li>
          <blockquote><p>“${escape(review.quote)}”</p></blockquote>
          <p class="review-byline"><a href="${escape(review.source)}">${escape(review.author)}</a><span aria-label="5 üzerinden 5 yıldız">5/5</span></p>
        </li>`).join("")}</ul>
        <a class="text-link" href="${escape(mapUrl)}">Google Haritalar’da tüm yorumları gör <span aria-hidden="true">→</span></a>
      </div>
      <div class="visit-location">
        <figure>
          <img src="${escape(storefront.image)}" alt="Çınar Ticaret dükkânının dış cephesi" width="390" height="278" loading="lazy" decoding="async">
          <figcaption><a href="${escape(storefront.source)}">Çınar Ticaret fotoğrafı · Google Haritalar</a></figcaption>
        </figure>
        <address>${address}, Buca / İzmir</address>
        <a class="button button-primary" href="${escape(directionsUrl)}">Yol Tarifi Al</a>
      </div>
    </div>
  </section>`,
});
}

pages.set("/", renderHome(null));

export function renderCatalog(categories) {
  return page({
    path: catalogPath, title: "Kombi Yedek Parça Kataloğu | Çınar Ticaret İzmir",
    description: "Çınar Ticaret kombi yedek parça kataloğunda ürünleri kategorilerine göre inceleyin.",
    schema: breadcrumbSchema([["Yedek Parçalar", catalogPath]]),
    body: `${pageIntro([["Yedek Parçalar", catalogPath]], "Kombi Yedek Parça Kataloğu", "Parça türüne göre inceleyin. Uyumlu parçayı bulmak için kombinizin tam modelini ve varsa parçanın üzerindeki kodu bizimle paylaşın.")}
    <div class="container subpage">${categoryCards(categories)}</div>`,
  });
}

pages.set(catalogPath, renderCatalog(null));

export function renderCategory(category, products) {
  const items = [["Yedek Parçalar", catalogPath], [category.name, categoryPath(category)]];
  return page({
    path: categoryPath(category), title: `${category.name} | Çınar Ticaret Buca İzmir`,
    description: category.description || `${category.name} kategorisindeki kombi yedek parçalarını inceleyin.`,
    schema: breadcrumbSchema(items),
    body: `${pageIntro(items, category.name, category.description)}
    <div class="container subpage">
      ${products.length ? productList(products) : "<p>Bu kategorideki parça seçeneklerini öğrenmek için bizimle iletişime geçin.</p>"}
      ${whatsappButton(messageLink(`Merhaba, ${category.name} kategorisinden bir parça hakkında bilgi almak istiyorum.`), "Parça bilgisi iste")}
    </div>`,
  });
}

export function renderProduct(product) {
  const category = { name: product.category_name, slug: product.category_slug };
  const items = [["Yedek Parçalar", catalogPath], [category.name, categoryPath(category)], [product.name, productPath(product)]];
  const description = product.description || `${product.name} için parça uyumluluğu hakkında Çınar Ticaret ile iletişime geçin.`;
  const image = imagePath(product.image);
  const code = /^ORNEK-\d+$/.test(product.sku) ? "" : product.sku;
  return page({
    path: productPath(product), title: `${product.name} | Çınar Ticaret`, description,
    schema: {
      "@context": "https://schema.org", "@graph": [
        breadcrumbSchema(items),
        { "@type": "Product", name: product.name, description, ...(code ? { sku: code } : {}), ...(image ? { image: `${origin}${image}` } : {}) },
      ],
    },
    body: `${pageIntro(items, product.name)}
    <div class="container subpage ${image ? "business-inner" : ""}">
      <div>
        <p class="lead">${escape(description)}</p>
        ${code ? `<p><strong>Ürün kodu</strong> ${escape(code)}</p>` : ""}
        ${whatsappButton(messageLink(`Merhaba, ${product.name} için uyumluluk bilgisi alabilir miyim?`), "Uyumluluk bilgisi iste")}
      </div>
      ${image ? `<img class="catalog-product-image" src="${escape(image)}" alt="${escape(product.name)}">` : ""}
    </div>`,
  });
}

const repairDescription = "Kombi elektronik kart tamiri. Kombinizin marka ve modelini, hata kodunu ve arıza belirtisini Çınar Ticaret’e iletin.";
add({
  path: repairPath, title: "Kombi Kart Tamiri | Çınar Ticaret Buca İzmir", description: repairDescription,
  schema: {
    "@context": "https://schema.org", "@type": "Service", name: "Kombi Kart Tamiri",
    description: repairDescription, provider: { "@id": `${origin}/#isletme` },
  },
  body: `${pageIntro([["Kart Tamiri", repairPath]], "İzmir Buca Kombi Kart Tamiri", "Çınar Ticaret’te kombi elektronik kartları için tamir ve parça temini hakkında bilgi alabilirsiniz.")}
  <div class="container subpage business-inner">
    <div>
      <h2>Bilgi almak için neler paylaşabilirsiniz?</h2>
      <ul class="details-list"><li>Kombinin marka ve modeli</li><li>Ekranda görünen hata kodu ve arıza belirtisi</li><li>Elinizde varsa devre kartının fotoğrafı ve kart üzerindeki kod</li></ul>
      ${whatsappButton(messageLink("Merhaba, kombi kart tamiri hakkında bilgi alabilir miyim?"), "Kart tamiri bilgisi al")}
    </div>
    ${repairPhoto("eager")}
  </div>`,
});

const aboutDescription = "Çınar Ticaret, İzmir’in Buca ilçesinde kombi yedek parça satışı ve kombi elektronik kart tamiri hizmeti sunar.";
add({
  path: aboutPath, title: "Hakkımızda | Çınar Ticaret Buca İzmir", description: aboutDescription,
  schema: {
    "@context": "https://schema.org", "@type": "AboutPage", name: "Çınar Ticaret Hakkında",
    url: `${origin}${aboutPath}`, description: aboutDescription, about: { "@id": localBusiness["@id"] },
  },
  body: `${pageIntro([["Hakkımızda", aboutPath]], "Çınar Ticaret Hakkında")}
  <div class="container subpage">
    <p class="lead">Çınar Ticaret olarak İzmir’in Buca ilçesinde kombi yedek parça satışı ve elektronik kart tamiri hizmeti veriyoruz. Kombi kullanıcılarına ve servis ustalarına, cihazın modeline uygun parçanın belirlenmesi ve arızalı kartın tamire uygunluğunun değerlendirilmesi konusunda yardımcı oluyoruz.</p>
    <div class="about-copy">
      <h2>Kombi yedek parça temini</h2>
      <p>Elektronik kontrol kartları, sirkülasyon pompaları, fan grupları, üç yollu vanalar ve NTC sıcaklık sensörleri başlıca ürün gruplarımız arasında yer alır. Aynı marka ve model adı altında farklı cihaz serileri bulunabildiğinden parça seçiminde cihaz etiketindeki tam model bilgisini esas alıyoruz. Gerektiğinde mevcut parçanın üzerindeki ürün kodunu ve bağlantı tipini de kontrol ediyoruz.</p>
      <p>Parça adı veya kodu elinizde yoksa cihaz etiketinin ve mevcut parçanın fotoğrafını paylaşabilirsiniz. Bu bilgiler, uyumlu seçenekleri belirlememize ve güncel stok ile fiyat hakkında bilgi vermemize yardımcı olur.</p>

      <h2>Kombi elektronik kart tamiri</h2>
      <p>Elektronik kart, kombinin ateşleme ve çalışma sırasını yönetir, sensörlerden gelen bilgileri işler ve bağlı bileşenleri kontrol eder. Kart arızası şüphesi olduğunda cihazın marka ve modelini, varsa ekrandaki hata kodunu ve arızanın hangi aşamada görüldüğünü soruyoruz. Kart üzerindeki kod ve revizyon bilgisi de değerlendirmeye yardımcı olur.</p>
      <p>Kartın durumu değerlendirildikten sonra tamir seçeneği hakkında bilgi veriyoruz. Değişim gerektiğinde cihazla uyumlu kartın temin seçeneklerini birlikte inceliyoruz.</p>

      <h2>Parça ve tamir hakkında bilgi almak için</h2>
      <p>Telefon veya WhatsApp üzerinden cihazın tam modelini ve aradığınız parçayı iletebilirsiniz. Kart tamiri için arıza belirtisini ve varsa hata kodunu eklemeniz yeterli. Mağazaya gelmek isterseniz güncel adresi ve yol tarifini İletişim sayfasında bulabilirsiniz.</p>
    </div>
    <div class="actions">
      <a class="button button-primary" href="${catalogPath}">Yedek Parçaları İncele</a>
      <a class="button button-outline" href="${repairPath}">Kart Tamiri</a>
      <a class="button button-outline" href="${contactPath}">İletişim ve Konum</a>
    </div>
  </div>`,
});

add({
  path: contactPath, title: "İletişim ve Yol Tarifi | Çınar Ticaret Buca İzmir",
  description: "Çınar Ticaret iletişim bilgileri ve Google Haritalar yol tarifi. Ufuk Mahallesi, Seyfi Demirsoy Caddesi 58/A, Buca, İzmir.",
  schema: localBusiness,
  body: `${pageIntro([["İletişim", contactPath]], "Çınar Ticaret İletişim")}
  <div class="container subpage">
    <div class="contact-layout">
      <div>
        <dl class="contact-details">
          <div><dt>Yetkili kişi</dt><dd>Mümtaz Furkan İkizler</dd></div>
          <div><dt>E-posta</dt>
            ${contactEmails.map(email => `<dd><a href="mailto:${email}">${email}</a></dd>`).join("")}
          </div>
          <div><dt>GSM</dt>
            <dd><a href="tel:${phone}">${phoneLabel}</a></dd>
            <dd><a href="tel:+905424547595">0542 454 75 95</a></dd>
          </div>
          <div><dt>Adres bilgileri</dt><dd><address>${address}<br>Buca / İzmir</address></dd></div>
        </dl>
        <div class="actions"><a class="button button-primary" href="${escape(mapUrl)}">Google Haritalar’da Aç</a>${whatsappButton()}</div>
      </div>
      <iframe class="contact-map" title="Google Haritalar’da Çınar Ticaret, Buca" src="${escape(mapEmbedUrl)}" width="640" height="380" loading="lazy" allowfullscreen></iframe>
    </div>
  </div>`,
});

function addAuthPage(path, heading, entry) {
  add({
    path, title: `${heading} | Çınar Ticaret`,
    description: `Çınar Ticaret ${heading.toLocaleLowerCase("tr")}.`,
    standalone: true, noindex: true,
    body: `<div class="login-screen">
    <section class="login-card" aria-labelledby="giris-baslik">
      <div class="login-brand"><img src="/assets/cinar-favicon-green.png" alt="" width="34" height="34">Çınar Ticaret</div>
      <h1 id="giris-baslik">${escape(heading)}</h1>
      <div id="${entry}-root"><p role="status">Oturum kontrol ediliyor…</p></div>
      <noscript><p>Bu sayfayı kullanmak için JavaScript’i etkinleştirin.</p></noscript>
    </section>
  </div>
  <script type="module" src="/assets/${entry}.mjs"></script>`,
  });
}

addAuthPage(loginPath, "Yönetici girişi", "login");
add({
  path: adminPath, title: "Katalog Yönetimi | Çınar Ticaret",
  description: "Çınar Ticaret ürün ve kategori yönetimi.", standalone: true, noindex: true,
  body: `<div id="admin-root"><div class="login-screen"><div class="login-card">
      <h1>Katalog yönetimi</h1><p role="status">Oturum kontrol ediliyor…</p>
    </div></div></div>
    <script type="module" src="/assets/admin.mjs"></script>`,
});

add({
  path: "/404.html", title: "Sayfa Bulunamadı | Çınar Ticaret", description: "Aradığınız sayfa bulunamadı.", noindex: true,
  body: `${pageIntro([], "Sayfa bulunamadı")}
  <div class="container subpage"><a class="button button-primary" href="${catalogPath}">Yedek parçaları incele</a></div>`,
});
