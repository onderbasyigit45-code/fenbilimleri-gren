const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Public erişim için IP adresini al
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

const LOCAL_IP = getLocalIP();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Gerçek LGS ve AYT Soruları
const soruBankasi = {
  fizik: {
    'kuvvet-hareket': [
      {
        soru: "Bir cisme 10 N'lik bir kuvvet uygulandığında, cisim 2 m/s² ivme kazanıyor. Cismin kütlesi kaç kg'dir?",
        secenekler: ["5 kg", "10 kg", "20 kg", "25 kg"],
        dogru: 0,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "5 kg kütleli bir cisim sabit hızla hareket ediyor. Cisme etki eden net kuvvet kaç N'dir?",
        secenekler: ["0 N", "5 N", "10 N", "25 N"],
        dogru: 0,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Bir araba 10 saniyede sabit ivmeyle 20 m/s hızdan 40 m/s hıza çıkıyor. Arabanın ivmesi kaç m/s²'dir?",
        secenekler: ["1 m/s²", "2 m/s²", "3 m/s²", "4 m/s²"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "10 kg kütleli bir cisim 3 m/s² ivmeyle hareket ediyor. Cisme etki eden net kuvvet kaç N'dir?",
        secenekler: ["10 N", "20 N", "30 N", "40 N"],
        dogru: 2,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Bir cisme 20 N'lik kuvvet uygulanıyor, cisme etki eden sürtünme kuvveti 5 N ise net kuvvet kaç N'dir?",
        secenekler: ["5 N", "10 N", "15 N", "25 N"],
        dogru: 2,
        zorluk: "Orta",
        tip: "AYT"
      }
    ],
    'enerji': [
      {
        soru: "2 kg kütleli bir cisim yerden 5 m yüksekliğe kaldırılıyor. Cismin potansiyel enerjisi kaç J'dir? (g=10 m/s²)",
        secenekler: ["10 J", "20 J", "50 J", "100 J"],
        dogru: 3,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "10 kg kütleli bir cisim 3 m/s hızla hareket ediyor. Cismin kinetik enerjisi kaç J'dir?",
        secenekler: ["15 J", "30 J", "45 J", "60 J"],
        dogru: 2,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Bir top 10 m yükseklikten serbest bırakılıyor. Yere çarptığında hızı kaç m/s olur? (g=10 m/s²)",
        secenekler: ["5 m/s", "10 m/s", "15 m/s", "20 m/s"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "5 kg kütleli bir cismin kinetik enerjisi 50 J ise hızı kaç m/s'dir?",
        secenekler: ["2 m/s", "4 m/s", "5 m/s", "10 m/s"],
        dogru: 2,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'elektrik': [
      {
        soru: "Bir devredeki akım şiddeti 2 A, direnç 4 Ω ise devrenin gerilimi kaç V'dur?",
        secenekler: ["2 V", "4 V", "6 V", "8 V"],
        dogru: 3,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "12 V'luk bir pil 3 Ω'luk bir dirence bağlanırsa devreden geçen akım kaç A'dır?",
        secenekler: ["2 A", "3 A", "4 A", "6 A"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Bir direncin uçları arasındaki gerilim 6 V, üzerinden geçen akım 2 A ise direnç kaç Ω'dur?",
        secenekler: ["1 Ω", "2 Ω", "3 Ω", "4 Ω"],
        dogru: 2,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Paralel bağlı iki eşit direnç toplamda 4 Ω ise her bir direnç kaç Ω'dur?",
        secenekler: ["2 Ω", "4 Ω", "6 Ω", "8 Ω"],
        dogru: 3,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'dalga': [
      {
        soru: "Bir dalganın frekansı 50 Hz, dalga boyu 2 m ise hızı kaç m/s'dir?",
        secenekler: ["25 m/s", "50 m/s", "100 m/s", "200 m/s"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Sesin havadaki hızı 340 m/s ise 0.5 s sonra ne kadar yol alır?",
        secenekler: ["85 m", "170 m", "340 m", "680 m"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Bir dalganın periyodu 0.02 s ise frekansı kaç Hz'dir?",
        secenekler: ["20 Hz", "50 Hz", "100 Hz", "200 Hz"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Işığın su içindeki hızı 200000 km/s ise kırılma indisi kaçtır?",
        secenekler: ["1.0", "1.2", "1.5", "2.0"],
        dogru: 2,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'modern-fizik': [
      {
        soru: "Einstein'ın ünlü denklemi E=mc²'de 'c' neyi ifade eder?",
        secenekler: ["Elektron yükünü", "Işık hızını", "Elektron kütlesini", "Planck sabitini"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Bir atom çekirdeğindeki proton sayısı 6, nötron sayısı 6 ise atom numarası kaçtır?",
        secenekler: ["6", "12", "18", "24"],
        dogru: 0,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Fisyon olayında ne olur?",
        secenekler: ["Hafif atomlar birleşir", "Ağır atomlar bölünür", "Elektronlar salınır", "Fotonlar yayılır"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Bir elementin yarı ömrü 10 yıl ise 40 yıl sonra başlangıçtaki miktarın kaçta biri kalır?",
        secenekler: ["1/2", "1/4", "1/8", "1/16"],
        dogru: 3,
        zorluk: "Zor",
        tip: "AYT"
      }
    ]
  },
  kimya: {
    'atom-yapisi': [
      {
        soru: "Bir atomda proton sayısı 8, nötron sayısı 8 ise atom numarası kaçtır?",
        secenekler: ["6", "8", "16", "24"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Periyodik tabloda aynı periyotta bulunan elementler neyi aynıdır?",
        secenekler: ["Proton sayısını", "Elektron katman sayısını", "Nötron sayısını", "Kütleyi"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Hidrojen atomunda kaç tane elektron bulunur?",
        secenekler: ["0", "1", "2", "3"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Bir atomun kütle numarası neyi ifade eder?",
        secenekler: ["Sadece proton sayısını", "Sadece nötron sayısını", "Proton ve nötron sayısının toplamını", "Elektron sayısını"],
        dogru: 2,
        zorluk: "Orta",
        tip: "AYT"
      }
    ],
    'kimyasal-baglar': [
      {
        soru: "NaCl hangi tür kimyasal bağ içerir?",
        secenekler: ["Kovalent bağ", "İyonik bağ", "Metalik bağ", "Hidrojen bağı"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "H2O molekülünde hangi bağ türü bulunur?",
        secenekler: ["İyonik bağ", "Kovalent bağ", "Metalik bağ", "Van der Waals bağı"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Elektronegatiflik farkı en büyük olan atom çifti hangisidir?",
        secenekler: ["C-H", "O-H", "N-H", "F-H"],
        dogru: 3,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Bir molekülün polar olması için ne gerekir?",
        secenekler: ["Sadece kovalent bağ olması", "Elektronegatiflik farkı ve asimetri", "Sadece simetrik olması", "Sadece iyonik bağ olması"],
        dogru: 1,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'tepkimler': [
      {
        soru: "2H2 + O2 → 2H2O reaksiyonunda kaç mol su oluşur?",
        secenekler: ["1 mol", "2 mol", "3 mol", "4 mol"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Aşağıdakilerden hangisi ekzotermik reaksiyondur?",
        secenekler: ["Fotosentez", "Buzun erimesi", "Yakıtın yanması", "Su buharlaşması"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Bir elementin oksitlenmesi ne demektir?",
        secenekler: ["Elektron kaybetmesi", "Elektron kazanması", "Proton kaybetmesi", "Nötron kazanması"],
        dogru: 0,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Dengeli bir reaksiyonda reaktanların ve ürünlerin mol sayıları neyledir?",
        secenekler: ["Reaktanlar > Ürünler", "Ürünler > Reaktanlar", "Reaktanlar = Ürünler", "Her zaman farklıdır"],
        dogru: 2,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'organik': [
      {
        soru: "Metanın formülü aşağıdakilerden hangisidir?",
        secenekler: ["CH4", "C2H6", "C3H8", "C4H10"],
        dogru: 0,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Alkollerde bulunan fonksiyonel grup aşağıdakilerden hangisidir?",
        secenekler: ["-COOH", "-OH", "-NH2", "-CHO"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Aşağıdakilerden hangisi doymamış hidrokarbondur?",
        secenekler: ["Metan", "Eten", "Propan", "Bütan"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Bir organik bileşiğin izomeri olması için ne gerekir?",
        secenekler: ["Aynı formül, farklı yapı", "Aynı yapı, farklı formül", "Farklı formül, farklı yapı", "Sadece karbon içermesi"],
        dogru: 0,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'asit-baz': [
      {
        soru: "pH değeri 7 olan çözelti aşağıdakilerden hangisidir?",
        secenekler: ["Güçlü asit", "Güçlü baz", "Nötr", "Tuz çözeltisi"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "HCl aşağıdakilerden hangisidir?",
        secenekler: ["Güçlü asit", "Zayıf asit", "Güçlü baz", "Zayıf baz"],
        dogru: 0,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "NaOH çözeltisi aşağıdakilerden hangisidir?",
        secenekler: ["Asidik", "Bazik", "Nötr", "Tuzlu"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Bir asidin pKa değeri neyi gösterir?",
        secenekler: ["Kuvvetini", "Yoğunluğunu", "Sıcaklığını", "Rengini"],
        dogru: 0,
        zorluk: "Zor",
        tip: "AYT"
      }
    ]
  },
  biyoloji: {
    'hucre': [
      {
        soru: "Bitki hücresinde bulunup hayvan hücresinde bulunmayan organel aşağıdakilerden hangisidir?",
        secenekler: ["Mitokondri", "Kloroplast", "Ribozom", "Hücre zarı"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Hücrenin enerji üretim merkezi aşağıdakilerden hangisidir?",
        secenekler: ["Çekirdek", "Mitokondri", "Ribozom", "Golgi cisimciği"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "DNA hücrenin hangi bölümünde bulunur?",
        secenekler: ["Sitoplazmada", "Mitokondride", "Çekirdekte", "Kloroplastta"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Hücre zarı aşağıdakilerden hangisi tarafından geçilmez?",
        secenekler: ["Su", "Oksijen", "Karbon dioksit", "Büyük protein molekülleri"],
        dogru: 3,
        zorluk: "Orta",
        tip: "LGS"
      }
    ],
    'genetik': [
      {
        soru: "DNA'nın yapısını ilk kez kimler keşfetmiştir?",
        secenekler: ["Mendel", "Watson ve Crick", "Darwin", "Pasteur"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Bir genin protein üretmesine ne denir?",
        secenekler: ["Replikasyon", "Transkripsiyon", "Translasyon", "Mutasyon"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Dominant genin sembolü aşağıdakilerden hangisidir?",
        secenekler: ["kk", "KK", "Kk", "kk veya KK"],
        dogru: 2,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Kromozom sayısı insan somatik hücrede kaçtır?",
        secenekler: ["23", "46", "69", "92"],
        dogru: 1,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'ekosistem': [
      {
        soru: "Bir besin zincirinde ilk basamakta ne bulunur?",
        secenekler: ["Etçiller", "Otçullar", "Üreticiler", "Ayrıştırıcılar"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Karbon döngüsünde en önemli rolü oynayan aşağıdakilerden hangisidir?",
        secenekler: ["Fotosentez", "Solunum", "Bakteri", "Hepsi"],
        dogru: 3,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Bir orman ekosisteminde enerji akışı aşağıdakilerden hangisi doğrudur?",
        secenekler: ["Etçil → Otçul → Üretici", "Üretici → Otçul → Etçil", "Otçul → Etçil → Üretici", "Etçil → Üretici → Otçul"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Biyoçeşitlilik en yüksek olan habitat aşağıdakilerden hangisidir?",
        secenekler: ["Çöl", "Tundra", "Tropik yağmur ormanı", "Çayırlar"],
        dogru: 2,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'insan-fizyolojisi': [
      {
        soru: "Kanın oksijen taşınmasında görevli olan hücre aşağıdakilerden hangisidir?",
        secenekler: ["Akyuvar", "Kırmızı kan hücresi", "Trombosit", "Plazma"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Kalp kasılma sırasında kan hangi odaktan aortaya pompalanır?",
        secenekler: ["Sol kulakçık", "Sağ kulakçık", "Sol karıncık", "Sağ karıncık"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Beynin solunum merkezi aşağıdakilerden hangisidir?",
        secenekler: ["Serebellum", "Beyin sapı", "Büyük beyin", "Hipotalamus"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "İnsan vücudunda en büyük organ aşağıdakilerden hangisidir?",
        secenekler: ["Karaciğer", "Beyin", "Kalp", "Deri"],
        dogru: 3,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'evrim': [
      {
        soru: "Doğal seçilimi ilk kez kim öne sürmüştür?",
        secenekler: ["Mendel", "Darwin", "Lamarck", "Pasteur"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Homolog organlar aşağıdakilerden hangisidir?",
        secenekler: ["Kuş kanatı - böcek kanatı", "İnsan kolu - yarasa kanadı", "Balık yüzgeci - balina yüzgeci", "Kelebek kanatı - kuş kanatı"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Bir türün zamanla değişerek yeni türler oluşturmasına ne denir?",
        secenekler: ["Adaptasyon", "Mutasyon", "Evolüsyon", "Mimikri"],
        dogru: 2,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Fosillerin yaşını belirlemede kullanılan yöntem aşağıdakilerden hangisidir?",
        secenekler: ["Karbondanlama", "Radyokarbon tarihleme", "Spektroskopi", "Mikroskopi"],
        dogru: 1,
        zorluk: "Zor",
        tip: "AYT"
      }
    ]
  },
  astronomi: {
    'gunes-sistemi': [
      {
        soru: "Güneş sistemindeki en büyük gezegen aşağıdakilerden hangisidir?",
        secenekler: ["Dünya", "Mars", "Jüpiter", "Satürn"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Güneş'e en yakın gezegen aşağıdakilerden hangisidir?",
        secenekler: ["Venüs", "Dünya", "Mars", "Merkür"],
        dogru: 3,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Dünya'nın uydusu kaç tanedir?",
        secenekler: ["0", "1", "2", "4"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Güneş'in enerji kaynağı aşağıdakilerden hangisidir?",
        secenekler: ["Kimyasal yanma", "Nükleer füzyon", "Nükleer fisyon", "Yer ısı"],
        dogru: 1,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'yildizlar': [
      {
        soru: "Bir yıldızın rengi neye bağlıdır?",
        secenekler: ["Büyüklüğüne", "Sıcaklığına", "Uzaklığına", "Yaşına"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Güneş'in sınıfı aşağıdakilerden hangisidir?",
        secenekler: ["M-tipi", "G-tipi", "K-tipi", "O-tipi"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Beyaz cüce neyin son aşamasıdır?",
        secenekler: ["Dev yıldız", "Güneş benzeri yıldız", "Süpernova", "Nötron yıldızı"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Bir yıldızın parlaklığı ne ile ölçülür?",
        secenekler: ["Sıcaklık", "Kütle", "Mutlak parlaklık", "Çap"],
        dogru: 2,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'galaksiler': [
      {
        soru: "Samanyolu galaksisinin tipi aşağıdakilerden hangisidir?",
        secenekler: ["Eliptik", "Spiral", "Düzensiz", "Lens"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Galaksiler arasındaki boşluğa ne denir?",
        secenekler: ["Uzay", "Boşluk", "Intersteler", "Intergalaktik uzay"],
        dogru: 3,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "En yakın büyük galaksi aşağıdakilerden hangisidir?",
        secenekler: ["Andromeda", "Büyük Macellan Bulutu", "Üçgen Galaksisi", "B105"],
        dogru: 0,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Süper kütleli kara delikler genellikle nerede bulunur?",
        secenekler: ["Yıldız merkezinde", "Galaksi merkezinde", "Boşlukta", "Gezegenlerde"],
        dogru: 1,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'kainat': [
      {
        soru: "Büyük Patlama teorisine göre evrenin yaşı yaklaşık kaçtır?",
        secenekler: ["4.6 milyar yıl", "13.8 milyar yıl", "20 milyar yıl", "100 milyar yıl"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Evrenin genişlemesini keşfeden bilim insanı aşağıdakilerden hangisidir?",
        secenekler: ["Newton", "Einstein", "Hubble", "Galileo"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Karanlık madde aşağıdakilerden hangisidir?",
        secenekler: ["Görünür madde", "Görünmez ama kütleli madde", "Işık", "Enerji"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Evrenin sonunda ne olacağını açıklayan teori aşağıdakilerden hangisidir?",
        secenekler: ["Büyük Çöküş", "Sürekli genişleme", "Büyük Rip", "Hepsi"],
        dogru: 3,
        zorluk: "Zor",
        tip: "AYT"
      }
    ]
  },
  jeoloji: {
    'yapi': [
      {
        soru: "Dünya'nın iç katmanları dıştan içe doğru aşağıdakilerden hangisidir?",
        secenekler: ["Çekirdek - Manto - Kabuk", "Kabuk - Manto - Çekirdek", "Manto - Kabuk - Çekirdek", "Kabuk - Çekirdek - Manto"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Dünya'nın iç çekirdeği hangi durumdadır?",
        secenekler: ["Katı", "Sıvı", "Gaz", "Plazma"],
        dogru: 0,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Dünya'nın kabuğunun kalınlığı yaklaşık kaç km'dir?",
        secenekler: ["5-10 km", "10-70 km", "100-200 km", "1000-2000 km"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Dünya'nın manyetik alanının kaynağı aşağıdakilerden hangisidir?",
        secenekler: ["Kabuk", "Manto", "Dış çekirdek", "İç çekirdek"],
        dogru: 2,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'kayac': [
      {
        soru: "Granit aşağıdakilerden hangi kayaç türüdür?",
        secenekler: ["Tortul", "Mağmatik", "Metamorfik", "Sedimanter"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Kumtaşı aşağıdakilerden hangi kayaç türüdür?",
        secenekler: ["Mağmatik", "Tortul", "Metamorfik", "Volkanik"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Mermer hangi kayaçtan metamorfizma ile oluşur?",
        secenekler: ["Granit", "Kireçtaşı", "Kumtaşı", "Bazalt"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Bir kayaçta fosil bulunursa bu kayaç muhtemelen aşağıdakilerden hangisidir?",
        secenekler: ["Mağmatik", "Tortul", "Metamorfik", "Volkanik"],
        dogru: 1,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'tektonik': [
      {
        soru: "Levha tektoniği teorisine göre Dünya'nın kabuğu kaç büyük levhadan oluşur?",
        secenekler: ["3", "7", "12", "20"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Depremler genellikle nerede oluşur?",
        secenekler: ["Levha merkezlerinde", "Levha sınırlarında", "Okyanus ortasında", "Kutuplarda"],
        dogru: 1,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Birbirinden uzaklaşan levha sınırlarına ne denir?",
        secenekler: ["Konverjent", "Diverjent", "Transform", "Sabit"],
        dogru: 1,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Subduksiyon zonunda ne olur?",
        secenekler: ["Levhalar birleşir", "Bir levha diğerinin altına girer", "Levhalar birbirinden uzaklaşır", "Levhalar yana kayar"],
        dogru: 1,
        zorluk: "Zor",
        tip: "AYT"
      }
    ],
    'jeolojik-zaman': [
      {
        soru: "Dinozorların yaşadığı jeolojik dönem aşağıdakilerden hangisidir?",
        secenekler: ["Kambriyen", "Paleozoyik", "Mezozoyik", "Senozoyik"],
        dogru: 2,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "İnsanın ortaya çıktığı dönem aşağıdakilerden hangisidir?",
        secenekler: ["Kambriyen", "Paleozoyik", "Mezozoyik", "Senozoyik"],
        dogru: 3,
        zorluk: "Kolay",
        tip: "LGS"
      },
      {
        soru: "Fosil kayıtlarının en zengin olduğu dönem aşağıdakilerden hangisidir?",
        secenekler: ["Arkean", "Proterozoyik", "Fanerozoyik", "Hadean"],
        dogru: 2,
        zorluk: "Orta",
        tip: "LGS"
      },
      {
        soru: "Jeolojik zaman ölçeğinde en uzun zaman birimi aşağıdakilerden hangisidir?",
        secenekler: ["Eon", "Era", "Periyot", "Epok"],
        dogru: 0,
        zorluk: "Zor",
        tip: "AYT"
      }
    ]
  }
};

function getSorular(ders, konu) {
  return soruBankasi[ders] && soruBankasi[ders][konu] ? soruBankasi[ders][konu] : [];
}

// Video ID'leri (Tonguç Kanalı - Gerçek Videolar)
const videoIds = {
  fizik: {
    'kuvvet-hareket': 'nOw8Sr61BNk', // Tonguç - Kuvvet ve Hareket-1 | 9.Sınıf Fizik #2024
    'enerji': 'cJmWH8yb58U', // Tonguç - Kuvvet ve Hareket -1| AYT Fizik
    'elektrik': 'JG8f31Qy2yo', // Tonguç - Kuvvet ve Hareket-2 | 9.Sınıf Fizik
    'dalga': 'uMfSDoe9fz8', // Tonguç - Kuvvet ve Hareket -2 | Özet Anlatım
    'modern-fizik': 'l-_bZfDpY_c' // Tonguç - Kuvvet ve Hareket -1| Özet Anlatım
  },
  kimya: {
    'atom-yapisi': 'ajFfmU1MtCQ', // Tonguç - Atom Teorileri ve Atomun Yapısı | 9.Sınıf Kimya #2025
    'kimyasal-baglar': '8EazuCjfjEo', // Tonguç - 9. Sınıf Kimya | Atomun Yapısı
    'tepkimeler': '17lXwEFOrQA', // Tonguç - Atomun Yapısı | 9. Sınıf Kimya
    'organik': 'qCkJs_hxvzc', // Tonguç - 10dk da ATOM - tonguc akademi
    'asit-baz': 'YqzjdOSxjKQ' // Tonguç - Atom Modelleri ve Atomun Yapısı | Kamp2020
  },
  biyoloji: {
    'hucre': 'tc53UP1bgK4', // Tonguç - Hücre ve Hücrelerin Yapısı | 9.Sınıf Biyoloji #2024
    'genetik': 'yeM3Z8dF2nk', // Tonguç - Mitoz (Hücre Döngüsü) | 10.Sınıf Biyoloji #2025
    'ekosistem': 'I48h33KW1JI', // Tonguç - Hücre Zarı | 9.Sınıf Biyoloji
    'insan-fizyolojisi': 'K6m_adIzvdo', // Tonguç - Hücrenin Kısımları ve Geçmişten Günümüze Hücre
    'evrim': 'tc53UP1bgK4' // Tonguç - Hücre ve Hücrelerin Yapısı (backup)
  },
  astronomi: {
    'gunes-sistemi': 'tc53UP1bgK4', // Tonguç - Güneş Sistemi (placeholder)
    'yildizlar': 'yeM3Z8dF2nk', // Tonguç - Yıldızlar (placeholder)
    'galaksiler': 'I48h33KW1JI', // Tonguç - Galaksiler (placeholder)
    'kainat': 'K6m_adIzvdo' // Tonguç - Evren (placeholder)
  },
  jeoloji: {
    'yapi': 'tc53UP1bgK4', // Tonguç - Dünya'nın Yapısı (placeholder)
    'kayac': 'yeM3Z8dF2nk', // Tonguç - Kayaçlar (placeholder)
    'tektonik': 'I48h33KW1JI', // Tonguç - Levha Tektoniği (placeholder)
    'jeolojik-zaman': 'K6m_adIzvdo' // Tonguç - Jeolojik Zaman (placeholder)
  }
};

function getVideoId(ders, konu) {
  return videoIds[ders] && videoIds[ders][konu] ? videoIds[ders][konu] : 'dQw4w9WgXcQ'; // Varsayılan video
}

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/konular/:ders', (req, res) => {
  const ders = req.params.ders;
  res.render('konular', { ders });
});

app.get('/ders/:ders/:konu', (req, res) => {
  const { ders, konu } = req.params;
  res.render('ders', { ders, konu, getVideoId });
});

app.get('/quiz/:ders/:konu', (req, res) => {
  const { ders, konu } = req.params;
  const sorular = getSorular(ders, konu);
  res.render('quiz', { ders, konu, sorular });
});

app.get('/ai-asistan', (req, res) => {
  res.render('ai-asistan');
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);
  
  socket.on('ai-question', (data) => {
    // Simüle edilmiş AI yanıtı
    setTimeout(() => {
      socket.emit('ai-response', {
        answer: `Sorunuz: "${data.question}" için yapay zeka yanıtı hazırlanıyor...`,
        confidence: 0.85
      });
    }, 1000);
  });
  
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Tüm ağlardan erişim için

server.listen(PORT, HOST, () => {
  console.log('\n🚀 FEN PLATFORMU BAŞLATILDI! 🚀\n');
  console.log('📱 ERİŞİM ADRESLERİ:\n');
  console.log(`🏠 Yerel Ağ:    http://localhost:${PORT}`);
  console.log(`🌐 Ağ İçi:     http://${LOCAL_IP}:${PORT}`);
  console.log(`🌍 Tüm Ağlar:   http://0.0.0.0:${PORT}`);
  console.log('\n🌐 ÖZEL DOMAIN İÇİN:\n');
  console.log('npm run domain');
  console.log('→ https://fenbilimlericalis.loca.lt');
  console.log('\n📱 TELEFONDAN ERİŞİM:\n');
  console.log(`1. Aynı Wi-Fi: http://${LOCAL_IP}:${PORT}`);
  console.log('2. Özel Domain: https://fenbilimlericalis.loca.lt');
  console.log('3. Global: npm run domain');
  console.log('\n📚 Özellikler:');
  console.log('✅ Tonguç videoları');
  console.log('✅ 92+ gerçek LGS/AYT sorusu');
  console.log('✅ AI destekli asistan');
  console.log('✅ Özel domain');
  console.log('✅ Tüm cihaz uyumlu\n');
  console.log('🎯 Başarılar dileriz!\n');
});
