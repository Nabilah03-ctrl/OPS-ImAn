# Edisi 3 · 30 cabaran

Pindaan kandungan berdasarkan prompt pengguna pada Oktober 2026.

- Enam stesen terbuka dari mula, lima cabaran setiap stesen. Kod masih enam digit.
- Awalan me-, mem-, men-, meng-, meny- dan menge- digunakan tepat lima kali setiap satu.
- Soalan objektif mempunyai tepat empat pilihan unik. Susunan dirawakkan dan disimpan semasa cubaan semula, bantuan dan muat semula.
- Stesen 1 memilih awalan sahaja; perkataan lengkap muncul selepas jawapan diterima.
- Stesen 2 mempunyai satu ruang padanan dengan seret atau tekan kad kemudian tekan ruang. Ejaan pengganggu kekal.
- Grid cari kata menerima perkataan sembilan huruf; sasaran hadir sekali, kiri ke kanan atau atas ke bawah.
- Kepingan Stesen 4 membantu ejaan; awalan dan kata dasar diterangkan berasingan.
- Stesen 5 membacakan ayat lengkap selepas jawapan betul. Stesen 6 berkembang daripada kad frasa kepada kad perkataan.
- Sijil memerlukan 30 rekod selesai dan kod akhir betul. Bantuan tidak menjejaskan kelayakan.

## Imej

30 ilustrasi perbuatan menggunakan Najmi, Putri dan Nabilah dalam gaya 3D. Setiap gambar dipadankan dengan objek dalam soalan; tindakan berulang mempunyai komposisi berbeza. Enam atlas asal berada dalam `dist/assets/actions30/`; `station-art.js` mengehadkan setiap paparan kepada satu perbuatan. Gambar semakan bersama soalan tersedia di `content-preview.html` (rujukan guru).

## Audio

354 teks aktif dijana dengan suara `ms-MY-YasminNeural`. Manifest juga menyimpan klip terdahulu yang masih dirujuk oleh ciri sedia ada. Semua 503 klip dalam manifest berjaya didekod dan mempunyai audio bukan senyap; ini bukan semakan sebutan oleh manusia. Rakaman guru dan suara peranti ms-MY masih diutamakan.

Rujukan suara: [Microsoft, sokongan bahasa dan suara](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts). Penjana tempatan menggunakan [node-edge-tts](https://github.com/SchneeHertz/node-edge-tts); klip siap disertakan supaya permainan tidak memerlukan perkhidmatan TTS semasa dimainkan.

## Reka bentuk sijil

Sijil A4 landskap menggunakan bingkai biru diraja dan emas, jalur hijau kebiruan, enam lencana berwarna serta ilustrasi polis 3D. Nama murid menjadi tumpuan; nama panjang dibalut dan dikecilkan secara automatik. Ruang nama guru dan sekolah turut menyesuaikan saiz teks.

Pratonton, PDF peribadi dan templat dalam Pusat Cetakan berkongsi reka bentuk yang sama. PDF peribadi mengekalkan teks vektor dan fon Nunito terbenam. Semua bingkai berada sekurang-kurangnya 10 mm dari tepi kertas. Versi jimat dakwat mempunyai latar putih dan bingkai nipis. Tarikh diambil daripada rekod penyelesaian, bukan tarikh mencetak. Markah dan TP tidak dimasukkan pada sijil.

## Rekod terdahulu

ID cabaran yang sama kini membawa soalan berbeza. Migrasi menyimpan salinan sesi terdahulu dalam arkib, termasuk jawapan, bantuan, bintang, ulasan dan sijil. Profil aktif memulakan set 30 cabaran baharu. Arkib boleh disemak dan sijil lama dibuka daripada Ruang Guru; arkib tidak digunakan untuk memberi kredit kepada soalan baharu.

## Semakan

- 30 ujian unit: kandungan tepat, imbangan awalan, pilihan, grid, padanan, kod, migrasi, sijil dan bahan cetak.
- Permainan penuh dalam urutan 6 → 2 → 4 → 1 → 5 → 3: 30 cabaran, jawapan salah, bantuan, seret, muat semula, kod akhir dan muat turun sijil.
- Tetapan tangan 1,000 ms dan tiada klik berulang semasa tudingan dikekalkan.
- 52 PDF / 200 halaman: versi berwarna dan jimat dakwat, tiada limpahan atau kad terpotong.
- Cache luar talian: aplikasi, gambar baharu, PDF, audio dan model tangan.
- Sijil baharu: PDF berwarna dan jimat dakwat satu halaman, cetakan tanpa kawalan permainan, teks panjang tidak bertindih, tarikh kekal dan boleh dibuka semula daripada rekod.
