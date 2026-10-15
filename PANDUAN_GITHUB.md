# Panduan ZIP OPS ImAn untuk GitHub

Pakej: edisi Bandar Polis ImAn, 15 Oktober 2026.
Kod asal: 5fdf325b54b99994a03c17676717e0dffb6fb113.

## 1. Ekstrak dahulu

Klik kanan ZIP → Extract All / Ekstrak Semua. Buka folder ops-iman.
Fail README.md, package.json, folder dist dan folder .github mesti berada terus pada aras utama repositori GitHub.
Jangan muat naik fail ZIP sebagai kod permainan; muat naik kandungan selepas diekstrak.

## 2. Muat naik menggunakan GitHub Desktop

1. Cipta repositori baharu dalam GitHub Desktop, contohnya ops-iman, pada folder kosong.
2. Salin semua kandungan folder ops-iman yang diekstrak ke folder repositori itu, termasuk .github dan .gitignore.
3. Masukkan ringkasan perubahan, Commit, kemudian Publish repository atau Push origin.
4. Pilih keterlihatan repositori mengikut keperluan anda.

Alternatif melalui laman GitHub: Add file → Upload files. Hadnya 100 fail sekali gus dan 25 MiB setiap fail; muat naik berkelompok sambil mengekalkan struktur folder. Semua fail individu pakej ini di bawah 25 MiB. ZIP lengkap melebihi had fail biasa, jadi ekstrak terlebih dahulu.

Rujukan: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## 3. Jadikan permainan boleh dibuka melalui pautan (pilihan)

1. Dalam repositori GitHub, buka Settings → Pages.
2. Pilih GitHub Actions sebagai sumber penerbitan. Ketersediaan Pages bergantung pada pelan dan keterlihatan repositori.
3. Buka tab Actions → Terbitkan OPS ImAn ke GitHub Pages → Run workflow.
4. Selepas berjaya, buka pautan yang dipaparkan pada deployment atau Settings → Pages.

Workflow sudah disediakan dalam .github/workflows/pages.yml. Ia menerbitkan kandungan dist dan hanya berjalan apabila anda memilih Run workflow. Ulang tindakan itu selepas kemas kini kod. Tiada kunci API, npm install atau proses binaan diperlukan untuk menerbitkan permainan siap ini.

Rujukan: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 4. Jalankan pada komputer

Pasang Node.js 22 atau lebih baharu. Dari folder ops-iman, jalankan:

    node tools/server.mjs

Kemudian buka http://127.0.0.1:4173. Pada Windows, Mula OPS ImAn.cmd juga tersedia selepas Node.js dipasang. Jangan buka dist/index.html melalui file://.

Untuk ujian unit:

    node --test tests/*.test.mjs

Untuk alatan pembangun yang memerlukan pakej tambahan, jalankan npm ci dahulu. Ujian pelayar sedia ada menggunakan laluan Chrome pada Windows.

## Kandungan dan rekod

Pakej termasuk 6 peringkat / 24 cabaran, 29 PNG chibi, 216 klip audio, 36 PDF kit, penjana sijil, fon, model tangan dan pustaka setempat. Kod aplikasi dalam dist sama dengan versi yang telah diuji.

ZIP tidak mengandungi node_modules, sejarah .git, cache kerja atau konfigurasi penerbitan Sites. Fail lesen pustaka dan fon disertakan. Rekod murid berada dalam pelayar dan tidak termasuk dalam ZIP. Rekod pada pautan Sites tidak berpindah secara automatik ke alamat GitHub Pages; gunakan eksport/import sandaran dalam permainan jika perlu.

Semakan kamera fizikal dan sebutan Melayu Malaysia masih memerlukan semakan guru. Lihat VERIFICATION.md untuk skop ujian.
