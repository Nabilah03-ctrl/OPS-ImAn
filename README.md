# OPS ImAn

Permainan maze imbuhan awalan untuk Bahasa Melayu Tahun 2 KSSR. Enam stesen dengan enam cara bermain, 24 cabaran, misi kod akhir dan sijil digital. Ilustrasi asal, 271 klip sintesis Melayu, penjejakan tangan pada peranti, rekod guru dan 26 jenis bahan cetakan dikekalkan atau ditambah.

## Mula bermain pada komputer ini

Klik dua kali **Mula OPS ImAn.cmd**. Ia membuka pelayan setempat di http://127.0.0.1:4173. Jangan membuka index.html terus melalui file:// kerana modul, simpanan luar talian dan kamera memerlukan pelayan.

Pada komputer lain, pasang Node.js 22 atau lebih baharu dan jalankan `node tools/server.mjs` dari folder ini. Aplikasi siap ada dalam `dist/`; pelayan statik HTTPS juga boleh menghidangkannya tanpa proses binaan. Tiada akaun murid atau pangkalan data pelayan digunakan.

## Panduan ringkas

1. Pilih Mula pengembaraan, isi nama dan kelas, pilih avatar dan kawalan.
2. Cuba tutorial, kemudian pilih satu daripada enam lokasi.
3. Bergerak menggunakan pad arah, sentuhan, anak panah atau WASD. Cari petunjuk bergambar dan jawab untuk membuka pintu. Salah jawapan tidak memadam kemajuan.
4. Selesaikan empat cabaran untuk memperoleh lencana dan satu digit kod. Kad Kod Saya menyimpan enam digit mengikut urutan stesen.
5. Berhenti atau sambung mengikut kemampuan. Selepas enam stesen selesai, gabungkan digit di Pusat Kawalan untuk membuka Peti Kejayaan dan sijil. Kod salah boleh dibetulkan tanpa mengulang stesen.

Soalan pilih jawapan, padanan dan isi tempat kosong menyediakan sekurang-kurangnya tiga pilihan. Kedudukan jawapan dan susunan awal bank kad dirawakkan bagi setiap aktiviti, kemudian disimpan supaya kekal ketika mencuba semula, menggunakan bantuan atau memuat semula permainan. Mod bimbingan dan **Kad Bantuan** memberikan petunjuk sambil mengekalkan tiga pilihan. Guru boleh menyediakan 3–6 pilihan berbeza dalam bank soalan. Latihan baharu mendapat susunan baharu.

## Peta dalaman stesen 3D

Pratonton keenam-enam peta tersedia di `station-preview.html` atau melalui **Kenali lokasi → Pratonton enam stesen**. Peta misi utama dikekalkan. Balai mempunyai laluan U; bilik siasatan empat ruang kerja; trafik gelung jalan; keselamatan laluan berselekoh; garaj satu lorong; dan udara laluan menuju helipad.

Watak Najmi, Putri dan Nabilah menggunakan ilustrasi kartun 3D semasa. Bangunan, perabot dan objek stesen mempunyai latar telus. Paparan soalan memfokuskan satu ilustrasi aksi 3D yang besar tanpa bangunan atau objek hiasan tambahan. Sumber dan prompt atlas baharu direkodkan dalam `docs/station-3d-art.md`.

Pilih nombor atau objek untuk bergerak ke cabaran melalui laluan yang sah. Kekunci Enter/Space dan tuding-tahan tangan juga boleh digunakan. Pintu masih dibuka mengikut turutan. Pada telefon, kamera mengikuti anggota dan peta kecil menunjukkan kedudukan; butang kawalan berada di luar peta.

Sesi lama dipindahkan ke titik selamat pada laluan baharu sebelum cabaran belum selesai. Jawapan, bantuan, bintang, kod, sijil dan ulasan guru kekal. Koordinat lama disimpan dalam `legacyPositions`; versi peta direkodkan secara berasingan daripada versi rekod pembelajaran.

Semakan: `node --test tests/*.test.mjs`, `node tools/qa-stations.mjs` dan `node tools/qa-missions.mjs`. Tetapkan `QA_ORIGIN` jika pelayan ujian bukan pada port 4189. Selepas mengubah fail `dist`, jana semula cache menggunakan `node tools/prepare-offline.mjs` sebelum penerbitan.

## Kurikulum dan pentaksiran

SK: **5.2 Memahami dan menggunakan pembentukan kata mengikut konteks.**

SP yang dibekalkan: **5.2.1 Memahami, mengenal pasti dan menggunakan kata terbitan mengikut konteks; (iii) kata berimbuhan awalan.**

Ruang Guru → Tetapan sesi menyediakan teks kurikulum boleh sunting dan penanda pengesahan guru. Rujukan perbandingan ialah dokumen KPM DSKP Bahasa Melayu SK Tahun 2, terbitan 2016, halaman 40, [salinan PDF](https://bukuteksdigital.my/wp-content/uploads/2020/06/DSKP-KSSR-SEMAKAN-2017-BAHASA-MELAYU-TAHUN-2.pdf). Guru perlu memadankannya dengan dokumen sekolah.

Enam peringkat perkembangan kemahiran bukan TP1–TP6. Bintang ialah ganjaran permainan. TP, tarikh dan ulasan hanya dimasukkan guru. Stesen 1–6 menggunakan pilih jawapan, padanan A–B, cari perkataan, susun suku kata, isi tempat kosong dan bina ayat. Jawapan aktiviti dinilai apabila dihantar; susunan kad tidak dinilai semasa diseret. Masa memasukkan kod tidak dinilai sebagai penguasaan bahasa.

## Audio

Keutamaan audio: rakaman guru yang dimuat naik → suara peranti `ms-MY` jika tersedia → klip sintesis Bahasa Melayu yang disertakan. **271 klip disertakan ialah sintesis bahasa `ms`; sebutan wilayah Malaysia belum disahkan atau disemak manusia.** Guru boleh menyemak dan menggantikan klip di Ruang Guru → Rakaman audio. Semua klip telah diuji boleh didekod dan tidak senyap; ini bukan pengesahan sebutan.

Audio lama dihentikan apabila audio baharu dimainkan. Muzik boleh dihidupkan dalam tetapan dan diperlahankan ketika suara dibaca. Rakaman sendiri disimpan dalam IndexedDB dan tidak dimasukkan dalam sandaran JSON; simpan fail asal sendiri.

## Kamera dan akses

Pilih mod Gerakan tangan untuk mengaktifkan kamera. Penjejakan MediaPipe menggunakan hujung jari telunjuk; tengah kanta ialah titik aktif. Tuding dan tahan butang selama 1 saat. Tiada cubitan diperlukan. Tahan kanta pada pad arah untuk bergerak perlahan. Kalibrasi dan sensitiviti tersedia.

Kamera memerlukan HTTPS atau localhost. Video diproses pada peranti, tidak dirakam atau dimuat naik. Apabila tangan hilang, watak dan masa aktif berhenti. Tetikus/sentuhan/papan kekunci tetap tersedia. Model telah diuji dapat dimuatkan dalam pelayar dengan kamera simulasi; ketepatan penjejakan pada kamera fizikal dan keadaan pencahayaan kelas perlu dicuba pada peranti sebenar.

## Kit cetakan

Pusat Cetakan menyediakan 26 jenis bahan, setiap satu dalam PDF berwarna dan jimat dakwat, termasuk papan A3 dan papan dua helaian A4. Bahan guru diasingkan daripada bahan murid. Pratonton menggunakan suntingan kandungan dan nama murid semasa; PDF siap ialah set asal. Untuk PDF tersuai, gunakan Cetak → Simpan sebagai PDF pada pratonton.

Cadangan: cetak skala 100%, potong pada garis putus-putus, lamina kad dan papan, pasang pelekat boleh tanggal dan susun dalam poket kit. Sesi 30 minit: pengenalan digital 3 minit, permainan 18 minit, aktiviti maujud 9 minit.

## Sijil digital Wira Imbuhan Awalan

Selepas semua 24 cabaran teras diselesaikan dan kod akhir tepat, murid menerima ucapan tahniah dan sijil penghargaan. Bantuan, contoh dan percubaan semula tidak menghalang kelayakan. Ulang kaji tidak menggantikan cabaran teras. Sijil menghargai penyelesaian dan usaha; tiada markah, kesalahan, kedudukan atau TP.

- Pilih **Lihat Sijil**, **Muat Turun PDF**, **Cetak Sijil** atau **Kembali ke Menu Utama** pada paparan tahniah.
- Nama dan kelas diambil daripada profil. Tarikh ialah masa Peti Kejayaan mula dibuka, dipaparkan mengikut Asia/Kuala_Lumpur, dan kekal apabila sijil dibuka semula. Rekod lama tanpa tarikh lengkap dibiarkan kosong, bukan digantikan dengan tarikh cetakan.
- Tetapkan nama guru dan sekolah di **Ruang Guru → Tetapan sesi**. Dalam pratonton sijil, buka **Semak nama dan pengesahan guru sebelum mencetak** untuk membetulkan butiran sijil sesi itu. Nama asal profil dikekalkan.
- Sijil boleh dibuka semula melalui peta, pencapaian atau **Ruang Guru → Rekod & pentaksiran → Semak → Lihat Sijil**.
- PDF dijana pada peranti, A4 landskap dengan bingkai dalam margin selamat sekurang-kurangnya 10 mm, fon terbenam dan teks vektor. Nama panjang dilaras dan dibalut tanpa dipotong. Nama fail: `Sijil_OPS_ImAn_[Nama_Murid].pdf`.
- Pilih **Versi jimat dakwat** untuk latar putih dan warna kelabu. Tetapan ini digunakan pada pratonton, muat turun dan cetakan. Cetakan menggunakan satu halaman tanpa butang; pilih skala 100% dan matikan pengepala/pengaki pelayar.
- Bintang dipaparkan kurang daripada tiga saat dan ditiadakan apabila tetapan kurang animasi aktif. Pilihan **Senyap** dan **Ulang suara** tersedia. Teks ucapan sijil boleh digantikan dengan rakaman guru melalui tab Rakaman audio.

Sijil Penyertaan dalam kit cetakan ialah templat aktiviti berasingan. Sijil digital penghargaan ini memerlukan penyelesaian semua cabaran dan pembukaan Peti Kejayaan. Sijil turut memaparkan 6 daripada 6 stesen selesai dan jumlah masa aktif, tanpa perbandingan murid. Sediakan aset luar talian sebelum menjana PDF tanpa internet. Sesi baharu / Main Semula Misi tidak mewarisi sijil; sijil sesi terdahulu kekal dalam rekod.

Ujian sijil: `node --test tests/certificate.test.mjs`, `node tools/qa-missions.mjs` (aliran 24 cabaran dan PDF). Ujian pelayar menggunakan Chrome setempat. PDF.js hanya digunakan oleh ujian untuk membaca teks dan memeriksa hasil PDF sebenar. `tools/prepare-certificate-vendors.mjs` menyediakan PDF-lib dan fontkit setempat daripada versi dalam `package-lock.json`.

## Rekod dan luar talian

Nama, kelas, jawapan, percubaan, bantuan, masa aktif, ayat dan ulasan disimpan dalam pelayar peranti. Eksport CSV atau sandaran JSON secara berkala. Data boleh hilang apabila data pelayar dipadam. Tiada papan kedudukan awam.

Tentang kit ini → Sediakan aset luar talian memuat turun model, audio, ilustrasi dan PDF ke cache pelayar. Tunggu pengesahan selesai sebelum memutuskan internet. Simpanan cache bergantung pada ruang dan dasar pelayar; akses hos persendirian mungkin memerlukan log masuk semasa dalam talian. Fail audio suntingan yang belum diganti mungkin tiada suara pada peranti tanpa `ms-MY`.

## Struktur dan penyelenggaraan

- `dist/content.js`: bank 24 cabaran, keluarga meN-, pengayaan pilihan dan kurikulum.
- `dist/engine.js`: penjana maze, perlanggaran, carian laluan dan klasifikasi bantuan.
- `dist/app.js`: permainan, borang, rekod, editor guru dan eksport.
- `dist/hands.js`: penjejakan kamera setempat dan pilihan tuding-tahan.
- `dist/audio.js`: main balik, sintesis ms-MY, rakaman guru dan bunyi lembut.
- `dist/print.js`: 18 bahan cetakan, pratonton dan kandungan tersuai.
- `dist/assets/pdf/`: PDF boleh dimuat turun.
- `dist/vendor/`: MediaPipe dan model tangan dibekalkan secara setempat.

Ujian: `node --test tests/engine.test.mjs`; `node tools/qa.mjs` dan `node tools/qa-features.mjs` menggunakan Playwright Core serta Chrome pada Windows. `node tools/generate-pdfs.mjs` menghasilkan PDF. `node tools/prepare-offline.mjs` perlu dijalankan selepas perubahan aset untuk mengemas kini cache luar talian.

MediaPipe: [panduan rasmi Hand Landmarker](https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/web_js). Fon Nunito: Google Fonts, SIL Open Font License. 29 ilustrasi PNG chibi dihasilkan khusus untuk OPS ImAn melalui built-in image_gen; ikon dan peta interaktif menggunakan SVG. Klip sintesis dijana melalui perkhidmatan Google Translate TTS; bukan rakaman manusia atau pengendorsan penyedia.

## Edisi Bandar Polis ImAn — 15 Oktober 2026

Tema biru navy, biru diraja dan emas meliputi pembukaan, profil, peta bandar, maze, soalan, pusat cetakan dan sijil. Tiga avatar mempunyai keupayaan sama. Enam bangunan dihubungkan oleh jalan dan mempunyai status jelas; empat cabaran lengkap membuka lokasi seterusnya, termasuk apabila selesai dengan bantuan.

Maze menggunakan grid perlanggaran asal dengan simpang tambahan. Koordinat kemajuan lama kekal sah. Butang **Ikut watak / Seluruh peta** menukar pandangan, dengan peta kecil pada mod ikut watak. Kamera maya ini tidak mengaktifkan kamera peranti. Kamera peranti hanya digunakan dalam kawalan tangan.

Bank kata, pengayaan, kurikulum dan ilustrasi dikekalkan. Sebanyak 24 cabaran kini menggunakan enam mekanik baharu. PDF kit (52 fail / 106 halaman) dan sijil dinamik menggunakan ilustrasi sedia ada. Kurang animasi menghentikan hiasan kereta, kipas dan lencana.

Aset dan prompt: [docs/visual-assets.md](docs/visual-assets.md). Kod visual: `dist/visuals.js` dan `dist/city-theme.css`. Ujian tambahan: `node --test tests/city.test.mjs` dan `node tools/qa-city.mjs`.

Jika tab lama masih memaparkan versi terdahulu, tutup semua tab OPS ImAn dan buka semula selepas kemas kini dimuat turun. Rekod peranti dikekalkan.

## Naik taraf enam stesen (21 Oktober 2026)

Nama avatar: Anggota Najmi, Anggota Putri dan Anggota Nabilah. Empat kata teras diulang melalui enam aktiviti: membaca, membantu, mencari dan mengawal.

Simpanan versi 2 menggunakan kunci pelayar yang sama. Rekod terdahulu, nama, jawapan, bantuan dan sijil tidak dipadam. Stesen lengkap menerima digit apabila simpanan dinaik taraf. Suntingan cabaran versi lama disimpan dalam legacyOverrides dalam sandaran JSON, kerana mekanik baharu menggunakan susunan tugasan berbeza. Murid lama yang sudah melengkapkan 24 cabaran boleh terus memasukkan kod.

Kod lalai ialah 427163, disimpan sekali bersama setiap sesi. Kod ini mekanik permainan dan boleh dirujuk pada bila-bila masa. Ulang kaji tidak memberikan digit atau ganjaran teras berganda.

Di Pusat Cetakan, pilih sesi murid untuk pasport dan kad kod yang sepadan. Butang PDF sesi ini pada kad kod menjana PDF terus daripada digit sesi, termasuk sifar di awal. Pratonton bahan lain menyediakan Cetak / Simpan PDF untuk salinan tersuai. Terdapat 52 PDF siap (berwarna dan jimat dakwat), 106 halaman.

Ujian: node --test tests/*.test.mjs. Ujian pelayar: node tools/qa-missions.mjs, dengan QA_ORIGIN jika pelayan bukan http://127.0.0.1:4189. Sediakan cache semula dengan node tools/prepare-offline.mjs selepas mengubah fail dist.
