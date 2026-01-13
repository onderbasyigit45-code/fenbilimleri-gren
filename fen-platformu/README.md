# Fen Platformu V2

Lise seviyesi fen öğrenimi platformu - Yapay zeka destekli, videolu konu anlatımları ve interaktif quizler ile modern eğitim deneyimi.

## 🚀 Özellikler

- **🎥 Tonguç Videoları**: Gerçek Tonguç kanalı videoları
- **🤖 Yapay Zeka Asistanı**: 7/24 hizmet veren AI destekli öğrenim asistanı
- **📝 Gerçek Sınav Soruları**: 92+ LGS ve AYT sorusu
- **📊 İlerleme Takibi**: Kişisel öğrenim grafiği ve performans analizi
- **📱 Tüm Cihazlardan Erişim**: Her yerden erişim imkanı
- **🌐 Public Erişim**: İnternet üzerinden tüm cihazlardan erişim
- **📚 5 Fen Dersi**: Fizik, Kimya, Biyoloji, Astronomi, Jeoloji

## 🌐 ERİŞİM SEÇENEKLERİ

### 1. **Yerel Ağ (Aynı Wi-Fi)**
```bash
npm start
# Erişim: http://localhost:3000
# Ağ içi: http://192.168.1.117:3000 (IP adresiniz)
```

### 2. **Özel Domain (Profesyonel)**
```bash
npm run domain
# Erişim: https://fenbilimlericalis.loca.lt
# Anında erişilebilir, hatırlaması kolay
```

### 3. **Her Cihazdan (Tunnelmole)**
```bash
npm run public
# Otomatik public link oluşturulur
# Tüm cihazlardan erişilebilir
```

### 4. **Global Erişim (Ngrok)**
```bash
npm run ngrok
# Global link oluşturulur
# İnternet üzerinden erişim
```

## 📱 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm (veya yarn)

### Adımlar

1. **Projeyi indirin**
   ```bash
   cd fen-platformu
   ```

2. **Global araçları kurun (tek seferlik)**
   ```bash
   npm run install-global
   ```

3. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

4. **Sunucuyu başlatın**
   ```bash
   npm start
   ```

5. **Public erişim (isteğe bağlı)**
   ```bash
   npm run public
   ```

## 📚 Dersler ve Konular

### **Fizik (5 Konu)**
- Kuvvet ve Hareket (5 soru)
- Enerji (4 soru)
- Elektrik (4 soru)
- Dalga (4 soru)
- Modern Fizik (4 soru)

### **Kimya (5 Konu)**
- Atom Yapısı (4 soru)
- Kimyasal Bağlar (4 soru)
- Tepkimeler (4 soru)
- Organik Kimya (4 soru)
- Asit ve Bazlar (4 soru)

### **Biyoloji (5 Konu)**
- Hücre (4 soru)
- Genetik (4 soru)
- Ekosistem (4 soru)
- İnsan Fizyolojisi (4 soru)
- Evrim (4 soru)

### **Astronomi (4 Konu)**
- Güneş Sistemi (4 soru)
- Yıldızlar (4 soru)
- Galaksiler (4 soru)
- Evren (4 soru)

### **Jeoloji (4 Konu)**
- Dünya'nın Yapısı (4 soru)
- Kayaçlar (4 soru)
- Levha Tektoniği (4 soru)
- Jeolojik Zaman (4 soru)

## 🎯 Quiz Sistemi

- **92+ Gerçek Soru**: LGS ve AYT standartlarında
- **Zorluk Seviyeleri**: Kolay, Orta, Zor
- **Anında Değerlendirme**: Otomatik puanlama
- **Performans Analizi**: Detaylı sonuçlar

## 🤖 AI Asistan

- **7/24 Hizmet**: Anında soru-cevap
- **Fen Bilimleri Uzmanlığı**: Fizik, Kimya, Biyoloji
- **İnteraktif Sohbet**: Gerçek zamanlı yanıt

## 📱 Cihaz Uyumluluğu

✅ **Mobil Telefonlar**  
✅ **Tabletler**  
✅ **Dizüstü Bilgisayarlar**  
✅ **Masaüstü Bilgisayarlar**  
✅ **Tüm İşletim Sistemleri**  

## 🔧 Teknolojiler

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Template Engine**: EJS
- **Real-time**: Socket.io
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)

## 📁 Proje Yapısı

```
fen-platformu/
├── server.js              # Express sunucusu
├── package.json           # Proje bağımlılıkları
├── views/                 # EJS şablonları
│   ├── index.ejs         # Ana sayfa
│   ├── konular.ejs       # Konular listesi
│   ├── ders.ejs          # Ders detay sayfası
│   ├── quiz.ejs          # Quiz sayfası
│   └── ai-asistan.ejs    # AI asistan sayfası
├── public/               # Statik dosyalar
│   ├── css/
│   │   └── style.css     # Ana stil dosyası
│   ├── js/
│   │   └── main.js       # JavaScript fonksiyonları
│   └── images/           # Görseller
└── README.md            # Bu dosya
```

## 🌐 Erişim Linkleri

Platformu başlattığınızda terminal'da göreceğiniz linkler:

```
🚀 FEN PLATFORMU BAŞLATILDI! 🚀

📱 ERİŞİM ADRESLERİ:

🏠 Yerel Ağ:    http://localhost:3000
🌐 Ağ İçi:     http://192.168.1.117:3000

📱 HER CİHAZDAN ERİŞİM İÇİN:
1. Yöntem: npm run public
2. Yöntem: npm run ngrok
```

## 📄 Lisans

Bu proje MIT lisansı altında dağıtılmaktadır.

## 🆞 Destek

Sorunlar veya öneriler için GitHub Issues kullanabilirsiniz.

---

**Fen Platformu V2** - Lise fen öğrenimini geleceğe taşı! 🚀
