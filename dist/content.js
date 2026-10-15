export const INTRO = 'Selamat datang ke OPS ImAn! Bandar ImAn memerlukan bantuan kamu. Jelajah laluan, cari petunjuk dan gunakan imbuhan awalan yang betul. Mari bantu penduduk bersama-sama!';
export const LEVELS = [
 {id:1,name:'Balai Polis',subtitle:'Kenali Kata',skill:'Mengingat',color:'#174BEB'},
 {id:2,name:'Pusat Siasatan dan Petunjuk',subtitle:'Bina Perkataan',skill:'Memahami',color:'#009DFF'},
 {id:3,name:'Pusat Trafik',subtitle:'Gunakan Kata',skill:'Mengaplikasi',color:'#FF8A00'},
 {id:4,name:'Kompleks Keselamatan',subtitle:'Semak dan Baiki',skill:'Menganalisis',color:'#16A34A'},
 {id:5,name:'Garaj dan Pusat Bantuan Polis',subtitle:'Pilih dan Beri Sebab',skill:'Menilai',color:'#FF8A00'},
 {id:6,name:'Pusat Kawalan Udara dan Helipad',subtitle:'Cipta Laporan Mini',skill:'Mencipta',color:'#174BEB'}
];
export const WORD_BANK = [
 {base:'baca',word:'membaca',prefix:'mem-',action:'reading',note:'mem- + baca → membaca. Anggota polis membaca buku nota.'},
 {base:'bantu',word:'membantu',prefix:'mem-',action:'helping',note:'mem- + bantu → membantu. Anggota polis membantu penduduk.'},
 {base:'cari',word:'mencari',prefix:'men-',action:'searching',note:'men- + cari → mencari. Anggota polis mencari beg yang tercicir.'},
 {base:'catat',word:'mencatat',prefix:'men-',action:'writing',note:'men- + catat → mencatat. Anggota polis mencatat maklumat.'},
 {base:'kawal',word:'mengawal',prefix:'meng-',action:'traffic',note:'kawal → mengawal. Huruf k pada kata dasar digugurkan.'},
 {base:'ambil',word:'mengambil',prefix:'meng-',action:'taking',note:'meng- + ambil → mengambil. Anggota polis mengambil beg.'},
 {base:'tulis',word:'menulis',prefix:'men-',action:'writing',note:'tulis → menulis. Huruf t pada kata dasar digugurkan.'},
 {base:'sapu',word:'menyapu',prefix:'meny-',action:'sweeping',note:'sapu → menyapu. Huruf s pada kata dasar digugurkan.'},
 {base:'lawat',word:'melawat',prefix:'me-',action:'walking',note:'me- + lawat → melawat. Anggota polis melawat taman komuniti.'}
];
const data = [
 ['reading','Pilih kata berimbuhan awalan bagi gambar ini.',['baca','membaca'],'membaca','Polis membaca buku nota. Kata dasarnya ialah baca.','Lihat buku nota yang dibuka. Cari perkataan yang mempunyai awalan.'],
 ['helping','Apakah yang dilakukan oleh anggota polis?',['membantu','bantu'],'membantu','Polis membantu warga emas membawa beg. Kata dasarnya ialah bantu.','Polis memberikan pertolongan kepada warga emas.'],
 ['searching','Pilih kata yang sepadan dengan gambar.',['cari','mencari'],'mencari','Polis mencari beg yang tercicir. Kata dasarnya ialah cari.','Lihat kanta pembesar dan beg di bawah bangku.'],
 ['traffic','Apakah tugas anggota polis dalam gambar?',['mengawal','kawal'],'mengawal','Polis mengawal lalu lintas. kawal menjadi mengawal; huruf k digugurkan.','Polis memastikan kenderaan dan pejalan kaki bergerak dengan selamat.'],
 ['reading','Perkataan asal (kata dasar): baca. Pilih kata berimbuhan.',['membaca','membantu'],'membaca','baca → membaca. Awalan mem- digunakan pada kata baca.','Perkataan ini digunakan apabila melihat dan memahami tulisan.'],
 ['helping','Perkataan asal (kata dasar): bantu. Pilih kata berimbuhan.',['mencari','membantu'],'membantu','bantu → membantu. Awalan mem- digunakan pada kata bantu.','Lihat huruf b dalam perkataan asal bantu.'],
 ['searching','Perkataan asal (kata dasar): cari. Pilih kata berimbuhan.',['mencari','mengawal'],'mencari','cari → mencari. Awalan men- digunakan pada kata cari.','Lihat anggota polis mencari beg.'],
 ['traffic','Perkataan asal (kata dasar): kawal. Pilih kata berimbuhan.',['membaca','mengawal'],'mengawal','kawal → mengawal. Huruf k digugurkan apabila menerima bentuk awalan meng-.','Kata ini digunakan untuk menjaga kelancaran lalu lintas.'],
 ['reading','Anggota polis ______ buku nota.',['mencari','membaca','mengawal'],'membaca','Anggota polis membaca buku nota.','Lihat mata polis yang memandang tulisan dalam buku.'],
 ['helping','Anggota polis ______ penduduk.',['membaca','mengawal','membantu'],'membantu','Anggota polis membantu penduduk.','Polis memberikan pertolongan dengan membawa beg.'],
 ['searching','Anggota polis ______ beg yang tercicir.',['mencari','membaca','mengawal'],'mencari','Anggota polis mencari beg yang tercicir.','Beg belum ditemukan oleh anggota polis.'],
 ['traffic','Anggota polis ______ lalu lintas.',['membantu','mengawal','membaca'],'mengawal','Anggota polis mengawal lalu lintas.','Lihat jalan, kenderaan dan lintasan.'],
 ['reading','Baiki ayat ini: “Anggota polis baca buku nota.”',['mencari','membaca','mengawal'],'membaca','Ayat betul: Anggota polis membaca buku nota.','Perkataan baca perlu menerima imbuhan awalan.'],
 ['helping','Baiki ayat ini: “Anggota polis bantu penduduk.”',['membantu','membaca','mencari'],'membantu','Ayat betul: Anggota polis membantu penduduk.','Perkataan bantu perlu menerima imbuhan awalan.'],
 ['traffic','Baiki ayat mengikut gambar: “Anggota polis membaca lalu lintas.”',['mencari','membantu','mengawal'],'mengawal','Ayat betul: Anggota polis mengawal lalu lintas.','Buku boleh dibaca. Lalu lintas pula perlu dikawal.'],
 ['searching','Baiki ayat mengikut gambar: “Anggota polis mengawal beg yang tercicir.”',['mencari','mengawal','membaca'],'mencari','Ayat betul: Anggota polis mencari beg yang tercicir.','Polis sedang berusaha menemukan beg.'],
 ['helping','Warga emas membawa beg yang berat. Pilih tugas polis.',['mengawal','membantu','membaca'],'membantu','Polis membantu warga emas kerana warga emas memerlukan pertolongan.','Lihat beg yang dibawa bersama-sama.'],
 ['traffic','Simpang jalan sibuk. Pilih tugas polis.',['mengawal','mencari','membaca'],'mengawal','Polis mengawal lalu lintas supaya pengguna jalan raya selamat.','Polis memberi isyarat kepada pengguna jalan raya.'],
 ['searching','Beg penduduk tercicir. Pilih tugas polis.',['membaca','mencari','mengawal'],'mencari','Polis mencari beg supaya beg dapat ditemukan semula.','Apakah yang perlu dilakukan apabila barang belum ditemukan?'],
 ['reading','Polis mahu mengetahui maklumat dalam nota. Pilih tugasnya.',['mencari','membantu','membaca'],'membaca','Polis membaca nota untuk mendapatkan maklumat.','Maklumat ditulis dalam buku nota.'],
 ['reading','Susun kad untuk membina ayat tentang polis membaca nota.',[],'membaca','Contoh: Anggota polis membaca buku nota. Ayat lain yang sesuai juga diterima.','Mulakan dengan siapa, kemudian perbuatan dan benda.'],
 ['helping','Susun kad untuk membina ayat tentang polis membantu penduduk.',[],'membantu','Contoh: Anggota polis membantu penduduk. Ayat lain yang sesuai juga diterima.','Siapakah yang memberikan pertolongan?'],
 ['searching','Pilih satu gambar. Bina ayat menggunakan mencari atau mengawal.',[],'mencari|mengawal','Contoh: Anggota polis mencari beg. Atau: Anggota polis mengawal lalu lintas.','Gunakan kata yang sepadan dengan gambar pilihan kamu.'],
 ['reading','Gabungkan dua gambar. Bina laporan mini dua ayat.',[],'membaca|membantu','Contoh: Anggota polis membaca buku nota. Anggota polis membantu penduduk.','Bina satu ayat bagi setiap gambar: membaca dan membantu.']
];
const reasonTexts = [
 'Kerana polis memberikan pertolongan.',
 'Supaya pengguna jalan raya selamat.',
 'Supaya beg dapat ditemukan semula.',
 'Untuk mendapatkan maklumat dalam nota.'
];
export const ITEMS = data.map((d,i)=>({id:`P${Math.floor(i/4)+1}-C${i%4+1}`,level:Math.floor(i/4)+1,index:i%4+1,action:d[0],prompt:d[1],choices:d[2],answer:d[3],accepted:d[3].split('|'),explanation:d[4],hint:d[5],audio:d[1],type:i>=20?'compose':i>=16?'reason':'choice',...(i>=16&&i<20?{reason:reasonTexts[i-16],reasonChoices:[reasonTexts[i-16],reasonTexts[(i-15)%4]]}:{}),...(i>=20?{example:d[4].replace('Contoh: ',''),cards:i===20?['buku nota.','membaca','Anggota polis']:i===21?['penduduk.','Anggota polis','membantu']:i===22?['beg.','mengawal','Anggota polis','mencari','lalu lintas.']:['penduduk.','membaca','Anggota polis','buku nota.','membantu','Anggota polis']}: {})}));
export const ENRICHMENT = [
 {group:'ber-',base:'jalan',word:'berjalan',action:'walking',sentence:'Anggota polis berjalan ke taman.',note:'ber- + jalan → berjalan.'},
 {group:'di-',base:'baca',word:'dibaca',action:'reading',sentence:'Buku nota dibaca oleh anggota polis.',note:'di- + baca → dibaca. Awalan di- dieja rapat.'},
 {group:'ter-',base:'jatuh',word:'terjatuh',action:'fallen',sentence:'Buku nota terjatuh di tepi bangku.',note:'ter- + jatuh → terjatuh.'}
];
export const CURRICULUM = {sk:'5.2 Memahami dan menggunakan pembentukan kata mengikut konteks.',sp:'5.2.1 Memahami, mengenal pasti dan menggunakan kata terbitan mengikut konteks; (iii) kata berimbuhan awalan.',document:'DSKP Bahasa Melayu Sekolah Rendah Tahun 2 KSSR',confirmed:false};
ITEMS.forEach(item=>{item.skill=LEVELS[item.level-1].skill;});
export const FACTS = ['Anggota polis membantu warga emas melintas jalan dengan selamat.','Polis mencatat maklumat supaya barang yang ditemukan dapat dipulangkan.','Anggota polis mengawal lalu lintas di kawasan sekolah.','Kita boleh meminta bantuan anggota polis apabila memerlukan pertolongan.','Polis membaca maklumat dalam buku nota sebelum membantu penduduk.','Bekerjasama dan menggunakan bahasa yang sopan membantu komuniti kita.'];
