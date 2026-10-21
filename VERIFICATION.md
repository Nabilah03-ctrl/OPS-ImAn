# Semakan OPS ImAn

## Fokus gambar, kawalan 1 saat dan pilihan rawak — 21 Oktober 2026

- 24 ujian unit lulus, termasuk pilihan unik minimum tiga, kedudukan jawapan betul boleh berada di setiap slot, susunan kekal selepas muat semula/bantuan, dan pemulihan rekod lama dengan dua pilihan.
- Ujian pelayar P2-C2 pada desktop dan telefon mengesahkan hanya satu ilustrasi aksi besar, tiga pilihan padanan dan jawapan betul masih diterima. Mod bimbingan dan Kad Bantuan mengekalkan tiga pilihan; percubaan salah dan muat semula tidak menukar susunan.
- Gelung kawalan tangan sebenar diuji dengan bingkai dan mercu tangan simulasi: belum mengklik pada 920 ms, mengklik pada 1000 ms, dan tidak mengklik berulang semasa tuding kekal. Ini menguji masa pencetus, bukan ketepatan pengesanan kamera fizikal.
- Aliran semua 24 cabaran dengan bank kad rawak, bantuan, enam kod, Peti Kejayaan, sijil PDF dan PDF kod sesi lulus tanpa ralat JavaScript.

Bukti: `artifacts/qa-focus-controls.json`, `artifacts/qa-missions.json`, `tests/choices.test.mjs`, dan imej `artifacts/focused-helping-*`.

## Enam ruang stesen 3D — 21 Oktober 2026

- Semua 20 ujian unit lulus: enam laluan berbeza, empat pintu berurutan, objek dan label tidak bertindih dengan laluan, serta migrasi koordinat lama tanpa mengubah bukti pembelajaran.
- Ujian Chrome menyelesaikan kesemua 24 cabaran, enam digit kod dan Peti Kejayaan melalui input sebenar. Percubaan semula, bantuan, jeda, muat semula, sijil PDF dan PDF kod sesi lulus; tiada ralat JavaScript.
- Enam peta diperiksa pada desktop, tablet dan telefon 390 px. Navigasi melalui papan kekunci dan sentuhan berfungsi; sasaran telefon sekurang-kurangnya 44 px, nisbah peta kekal, tiada limpahan mendatar atau permintaan aset gagal. Peta misi utama dan kandungan pembelajaran dibandingkan dengan versi terbitan sebelumnya dan kekal sama.
- Aktiviti sentuhan, mod bimbingan, menaip, rekod lama, kod bermula dengan sifar, kurang animasi, sijil jimat dakwat A4 landskap dan cetakan tanpa butang lulus. Selepas persediaan cache, permainan dimuat semula dan sijil dijana tanpa rangkaian.
- Model tangan setempat berjaya dimulakan dengan kamera simulasi; kehilangan tangan menghentikan masa dan pilihan tetikus berfungsi. Pengguna juga telah mengesahkan kamera fizikal boleh digunakan sebelum kemas kini visual ini.
- Pratonton `station-preview.html` menggunakan renderer permainan sebenar. Watak dan bangunan v2 3D dikekalkan; 20 prop baharu berkongsi satu atlas PNG telus. Prompt dan sumber tersedia dalam `docs/station-3d-art.md`.

Bukti: `artifacts/qa-stations.json`, `artifacts/qa-missions.json`, `artifacts/qa-mission-access.json`, serta imej `artifacts/station-*`. Keputusan lama di bawah ialah rekod sejarah.

Semakan dilaksanakan pada 14 Oktober 2026 menggunakan Chrome pada Windows.

- Ujian enjin: 12 konfigurasi maze (enam peringkat × standard/mudah) mempunyai laluan sah; empat pintu menghalang kemajuan sebelum cabaran berkaitan selesai; dinding tidak boleh ditembusi.
- Ujian pelayar: sesi baharu dengan nama dan kelas, semua enam maze dan 24 cabaran diselesaikan melalui input papan kekunci sebenar. Rekod jawapan salah pertama, percubaan, bintang berganda, empat jawapan terbuka, enam lencana dan TP manual disemak.
- Kemajuan dan masa kekal selepas muat semula. Masa aktif berhenti ketika jeda. Paparan 390 px tidak melimpah secara mendatar. Halaman utama boleh dimuat semula ketika luar talian selepas cache awal.
- Pad sentuhan, perlanggaran dinding, Lampu Laluan, Kanta Petunjuk, Radio Bantuan dan Kad Dua Pilihan disemak. Pengayaan ber- kekal pilihan guru. Suntingan soalan, medan SP(iii), saiz teks dan eksport CSV berfungsi.
- MediaPipe setempat berjaya diinisialisasi dengan kamera simulasi. Tiada tangan menyebabkan masa berhenti; penolakan kebenaran kamera memberikan pilihan tetikus tanpa kehilangan rekod. Penjejakan pada kamera fizikal belum diuji.
- Semua 203 MP3 berjaya didekod dan mempunyai audio tidak senyap. Ini mengesahkan fail audio berfungsi, bukan pengesahan sebutan Malaysia. Rakaman dan varian ms-MY memerlukan semakan guru/peranti.
- 36 PDF / 84 halaman: semakan geometri tiada limpahan, imej hilang atau kad terpotong. Jumlah halaman PDF sepadan dengan sumber. Semua 24 kad cabaran hadir. Bahan guru ditandakan berasingan. Maze bercetak mempunyai laluan 109 sel dan enam lokasi boleh dicapai.

Bukti tempatan: `artifacts/qa-result.json`, `artifacts/qa-features.json`, `tests/print-report.json`, dan `tools/audio-work/verification.json`. Skrip boleh diulang seperti diterangkan dalam README.

## Tambahan sijil digital — 15 Oktober 2026

- Lapan ujian enjin dan sijil lulus. Kelayakan memerlukan 24 rekod lengkap, menerima bantuan dan jawapan terbuka, serta menolak sesi dengan hanya 23 cabaran walaupun enam lencana ditandakan.
- Aliran enam maze / 24 cabaran diuji semula dengan papan kekunci. Cabaran terakhir membuka ucapan tahniah dan empat tindakan sijil; tiada ralat JavaScript.
- Ujian sijil dalam Chrome mengesahkan butiran guru daripada tetapan, pembetulan nama, tarikh selesai kekal selepas muat semula, dan sijil murid terdahulu boleh dibuka ketika sesi murid lain aktif.
- Tiga PDF dinamik (berwarna, jimat dakwat dan nama panjang) dimuat turun melalui butang sebenar, dibaca dan dirender dengan PDF.js. Setiap PDF mempunyai satu halaman 841.89 × 595.28 pt (A4 landskap). Teks sijil dan enam lencana kekal sebagai teks; tiada TP, markah atau kedudukan. Hasil visual disemak, termasuk nama panjang dan ilustrasi.
- Cetakan pelayar menghasilkan satu halaman A4 dan menyembunyikan semua kawalan. Bingkai paling luar berada kira-kira 11.4 mm dari pinggir, melebihi margin 10 mm. Ujian ini tidak menggunakan pencetak fizikal.
- Animasi hilang dalam tiga saat. Kedua-dua tetapan kurang animasi permainan dan sistem diuji. Senyap menghentikan suara; ulang suara memainkan klip ucapan sijil yang betul. Paparan 390 px tidak melimpah.
- Selepas persediaan aset luar talian, PDF boleh dijana tanpa rangkaian. Klip ucapan baharu berjaya didekod dan tidak senyap. Semakan ini tidak mengesahkan sebutan wilayah Malaysia; guru boleh menggantikan klip dengan rakaman yang telah disemak.

Bukti: `artifacts/qa-certificate.json`, `artifacts/qa-certificate-offline.json`, PDF dan imej `artifacts/certificate-*`. Kod ujian berada dalam `tests/certificate.test.mjs`, `tools/qa-certificate.mjs` dan `tools/qa-certificate-offline.mjs`.

## Edisi Bandar Polis ImAn — 15 Oktober 2026

- 11 ujian unit lulus. SHA-256 kandungan pembelajaran sebelum/selepas sama: 24 item, bank kata, pengayaan dan kurikulum tidak berubah. Dua belas konfigurasi maze boleh diselesaikan; setiap sekatan masih menghalang semua cabaran kemudian sehingga tugasan berkaitan selesai.
- Ujian aliran penuh Chrome lulus: enam peringkat, 24 rekod, 25 bintang dalam senario ujian, percubaan salah dan bantuan, jawapan terbuka, sijil, sambung sesi, masa jeda dan TP manual. Tiada ralat JavaScript.
- Kawalan sentuhan, petunjuk laluan, radio, dua pilihan, model MediaPipe setempat, kehilangan tangan, penolakan kamera, suntingan kandungan/kurikulum dan eksport CSV diuji semula dan lulus. Kamera simulasi digunakan; kamera fizikal belum diuji.
- Semakan visual 390, 768 dan 1440 px: pembukaan, tiga avatar, enam bangunan, status lokasi, maze dengan peta kecil, panduan lokasi, soalan dan koleksi peralatan. Tiada limpahan halaman mendatar, imej rosak atau permintaan gagal. Rekod dan bintang sesi sedia ada kekal selepas pemulihan; avatar terdahulu dan avatar bertudung berfungsi. Animasi kereta dan kipas berhenti apabila sistem meminta kurang animasi.
- 29 PNG asli disepadukan. Pratonton pertama mendedahkan pemotongan watak pada panorama dan logo telefon yang berbalut; nisbah gambar serta susunan pengepala dibetulkan dan diperiksa semula. Inventori dan prompt yang tersedia direkodkan dalam `docs/visual-assets.md`.
- Semua 36 PDF kit / 84 halaman dijana semula dengan ilustrasi baharu. Semakan automatik: tiada limpahan, kad terpotong atau imej hilang; 24 kad cabaran hadir; maze bercetak mempunyai laluan 109 sel dan enam lokasi. PDF terbesar sekitar 12.8 MB. Kulit, maze A3, kad cabaran dan sijil diperiksa secara visual.
- Sijil dinamik berwarna, jimat dakwat dan nama panjang dimuat turun melalui UI sebenar, dibaca dan dirender daripada PDF; setiap satu satu halaman A4 landskap. Ilustrasi lelaki, perempuan dan kenderaan disepadukan, teks kekal vektor. Pengesahan bantuan, tarikh kekal, pembetulan nama, rekod lama, senyap, ulang suara, kurang animasi dan cetakan pelayar lulus semula. Pencetak fizikal belum diuji.
- 216 MP3 berjaya didekod dalam Edge dan tidak senyap, termasuk nama lokasi dan arahan baharu. Peranti ujian tidak menyediakan suara `ms-MY`; klip sintesis `ms` digunakan. Sebutan Malaysia belum disemak manusia.
- Selepas semua aset dicache, halaman boleh dimuat semula tanpa rangkaian dan sijil PDF 3.5 MB boleh dijana; klip ucapan sijil turut didekod tanpa rangkaian. Cache baharu: `ops-iman-298f89ad21` (334 fail). Kebergantungan pada ruang cache dan sesi akses hos masih terpakai.

Bukti terkini: `artifacts/qa-city.json`, `artifacts/qa-result.json`, `artifacts/qa-features.json`, `artifacts/qa-certificate.json`, `artifacts/qa-certificate-offline.json`, `tests/print-report.json`, `tools/audio-work/verification.json`.
