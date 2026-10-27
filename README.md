# Mehmet Burak Aktaş — CV & Portföy

## Amaç ve hedef kitle

Havacılık, uçak mühendisliği ve yapay zekâ odağındaki kişisel CV ve portföy sitesi. Staj başvurularında, akademik ve profesyonel tanıtımda kullanılmak üzere tasarlanmıştır. Türkçe açılır; dil seçimi İngilizceye geçer.

Site, CV’de doğrulanan eğitim, staj ve Boeing parça montajı bilgisini kullanır. Kaynak CV’deki telefon, açık adres, doğum tarihi ve kimlik alanı yayımlanmaz. E-posta ve LinkedIn başlangıçta boş bırakılmıştır. Projeler alanı, gerçek çalışmalar eklenene kadar boş durum açıklaması gösterir. Python, makine öğrenmesi ve yapay zekâ etiketleri yetkinlik iddiası değil, düzenlenebilir gelişim alanlarıdır.

## Teknolojiler

- Semantik HTML, CSS ve ES modülleri kullanan bağımlılıksız statik web sitesi
- Yerel geliştirme sunucusu ve statik çıktı üretimi için Node.js yerleşik modülleri
- Güvenli Türkçe ve İngilizce web CV’leri için ReportLab ile oluşturulmuş PDF dosyaları
- Harici görsel URL'si, yazı tipi, izleyici veya çalışma zamanı paketi yoktur; havacılık görseli yerel PNG dosyasından yüklenir

## Yerel çalıştırma

Node.js 20 veya daha yenisi gerekir. Bağımlılık kurulumu olmadan:

```bash
npm run dev
```

Siteyi `http://127.0.0.1:4173` adresinde açın.

## Kontroller ve üretim çıktısı

```bash
npm run lint
npm test
npm run build
npm run preview
```

Üretim dosyaları `dist/` klasörüne kopyalanır. `npm run preview` derlenmiş çıktıyı `http://127.0.0.1:4173` adresinde sunar. Proje dağıtım için Vercel’in statik site çıktısı olarak yapılandırılmıştır; GitHub’a push veya Vercel dağıtımı bu proje çalışmasında yapılmamıştır.

## İçeriği düzenleme

- İsteğe bağlı iletişim bilgileri: `src/content.js` içindeki `portfolio.contact.email` ve `portfolio.contact.linkedin` alanlarını doldurun. LinkedIn için herkese açık profil URL’si gerekir.
- Projeler: `portfolio.projects` dizisine `title` ve `description` için `{ tr, en }` metinleri ile isteğe bağlı doğrulanmış bir `https://` `url` ekleyin. Dizi boşken örnek proje gösterilmez.
- Düzenlenebilir gelişim alanları: `portfolio.editableSkillAreas` dizisini güncelleyin; içerik etiketleri yeterlilik beyanı değildir.
- Türkçe ve İngilizce arayüz metinleri: `src/content.js` içindeki `translations` nesnesinde tutulur.
- Eğitim, deneyim ve beceri bilgilerinde değişiklik yaparken CV kaynağını doğrulayın. `src/main.js` yalnızca `portfolio.contact` alanlarında geçerli e-posta ve LinkedIn URL’sini gösterir.

## Güvenli CV PDF’leri

`public/cv/` içindeki iki PDF kaynak CV’nin doğrudan kopyası değildir. Kişisel adres, telefon, doğum tarihi, kimlik alanı, form alanı veya tıklanabilir e-posta bağlantısı içermez. Türkçe ve İngilizce PDF metinleri `scripts/generate_cv.py` içindedir. Kaynak metni değiştirirseniz PDF’leri yeniden üretin ve yayına almadan önce görsel olarak kontrol edin. Üretim betiği macOS sistem Arial yazı tipini kullanır; Python ortamında `reportlab` gerekir.

## Dağıtım

GitHub üzerinden Vercel dağıtım hazırlığı için `.agents/skills/vercel-web-deployment/SKILL.md` yönergesine bakın. `vercel.json`, statik çıktı klasörünü `dist` olarak tanımlar.
