# Çınar Ticaret frontend

Üretimde Node.js uygulaması olarak yayınlamak için kurulum ve build komutu `npm ci && npm run build`, başlangıç komutu `npm start`. Depodaki `Dockerfile` Node.js 24 ile aynı uygulamayı `4173` iç portunda çalıştırır.

| Ortam değişkeni | Değer |
| --- | --- |
| `NODE_ENV` | `production` |
| `SITE_ORIGIN` | Frontend’in HTTPS kök adresi. Build ve çalışma ortamına ekle. |
| `DJANGO_ORIGIN` | Coolify’daki Django API’nin HTTPS kök adresi. Çalışma ortamına ekle. |

Yönetici girişi için frontend’in HTTPS kök adresini Django uygulamasındaki `CSRF_EXTRA_ORIGINS` listesine ekle.

Yerelde `npm ci` ve `npm run dev` kullan. Django varsayılan olarak `http://127.0.0.1:8000` adresinden beklenir. `npm run test:sites` Sites Worker kontrollerini çalıştırır.
