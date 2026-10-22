import {createItems,GAME_NAMES,MISSION_NAMES} from './missions.js';
export const INTRO = 'Selamat datang ke OPS ImAn! Bandar ImAn memerlukan bantuan kamu. Jelajah laluan, cari petunjuk dan gunakan imbuhan awalan yang betul. Mari bantu penduduk bersama-sama!';
export const LEVELS = [
 {id:1,name:'Balai Polis',subtitle:'Kenali Kata',skill:'Mengingat',color:'#174BEB'},
 {id:2,name:'Pusat Siasatan dan Petunjuk',subtitle:'Bina Perkataan',skill:'Memahami',color:'#009DFF'},
 {id:3,name:'Pusat Trafik',subtitle:'Gunakan Kata',skill:'Mengaplikasi',color:'#FF8A00'},
 {id:4,name:'Kompleks Keselamatan',subtitle:'Semak dan Baiki',skill:'Menganalisis',color:'#16A34A'},
 {id:5,name:'Garaj dan Pusat Bantuan Polis',subtitle:'Pilih dan Beri Sebab',skill:'Menilai',color:'#FF8A00'},
 {id:6,name:'Pusat Kawalan Udara dan Helipad',subtitle:'Cipta Laporan Mini',skill:'Mencipta',color:'#174BEB'}
];

LEVELS.forEach((level,i)=>{level.subtitle=GAME_NAMES[i];level.mission=MISSION_NAMES[i];level.skill=['Kenal','Padankan','Cari','Susun','Gunakan','Bina'][i];});
export const ITEMS = createItems(LEVELS);
export const WORD_BANK = [...new Map(ITEMS.map(i=>[i.word,{base:i.base,word:i.word,prefix:i.prefix,action:i.action,note:i.explanation+' '+i.sentence}])).values()];
export const ENRICHMENT = [
 {group:'ber-',base:'jalan',word:'berjalan',action:'walking',sentence:'Anggota polis berjalan ke taman.',note:'ber- + jalan → berjalan.'},
 {group:'di-',base:'baca',word:'dibaca',action:'reading',sentence:'Buku nota dibaca oleh anggota polis.',note:'di- + baca → dibaca. Awalan di- dieja rapat.'},
 {group:'ter-',base:'jatuh',word:'terjatuh',action:'fallen',sentence:'Buku nota terjatuh di tepi bangku.',note:'ter- + jatuh → terjatuh.'}
];
export const CURRICULUM = {sk:'5.2 Memahami dan menggunakan pembentukan kata mengikut konteks.',sp:'5.2.1 Memahami, mengenal pasti dan menggunakan kata terbitan mengikut konteks; (iii) kata berimbuhan awalan.',document:'DSKP Bahasa Melayu Sekolah Rendah Tahun 2 KSSR',confirmed:false};
ITEMS.forEach(item=>{item.skill=LEVELS[item.level-1].skill;});
export const FACTS = ['Anggota polis membantu warga emas melintas jalan dengan selamat.','Polis mencatat maklumat supaya barang yang ditemukan dapat dipulangkan.','Anggota polis mengawal lalu lintas di kawasan sekolah.','Kita boleh meminta bantuan anggota polis apabila memerlukan pertolongan.','Polis membaca maklumat dalam buku nota sebelum membantu penduduk.','Bekerjasama dan menggunakan bahasa yang sopan membantu komuniti kita.'];
