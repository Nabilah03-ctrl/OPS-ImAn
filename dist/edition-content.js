// Edition 3: the author's exact 30 challenges. Incorrect spellings occur only in choices.
export const CHALLENGES_PER_STATION=5;
export const CONTENT_VERSION=3;
const row=(base,word,prefix,object,choices=[],extra={})=>({base,word,prefix,object,choices,...extra});
export const STATION_CONTENT=[
 [
  row('lihat','melihat','me-','peta.',['me-','mem-','men-','meng-']),
  row('baca','membaca','mem-','buku panduan.',['men-','mem-','meny-','menge-']),
  row('dengar','mendengar','men-','pesanan melalui radio komunikasi.',['mem-','meng-','men-','meny-']),
  row('sapu','menyapu','meny-','halaman balai.',['menge-','men-','mem-','meny-']),
  row('cat','mengecat','menge-','pagar balai.',['menge-','men-','meng-','mem-'])
 ],
 [
  row('kawal','mengawal','meng-','lalu lintas.',['mengawal','mengkawal','memkawal','menkawal'],{explanation:'Kawal menjadi mengawal. Huruf k digugurkan.'}),
  row('pilih','memilih','mem-','topi.',['mempilih','memilih','menpilih','mengpilih'],{explanation:'Pilih menjadi memilih. Huruf p digugurkan.'}),
  row('tulis','menulis','men-','laporan.',['mentulis','memtulis','menulis','mengtulis'],{explanation:'Tulis menjadi menulis. Huruf t digugurkan.'}),
  row('susun','menyusun','meny-','fail.',['mensusun','memsusun','mengsusun','menyusun'],{explanation:'Susun menjadi menyusun. Huruf s digugurkan.'}),
  row('cap','mengecap','menge-','dokumen dengan cap getah.',['mengecap','mencap','mengcap','memcap'],{explanation:'Cap mempunyai satu suku kata. Bentuk yang betul ialah mengecap.'})
 ],
 [
  row('lompat','melompat','me-','dalam latihan kecergasan.'),
  row('buka','membuka','mem-','pintu kereta peronda.'),
  row('cuci','mencuci','men-','motosikal polis.'),
  row('ambil','mengambil','meng-','topi di atas meja.'),
  row('pam','mengepam','menge-','tayar basikal.')
 ],
 [
  row('rawat','merawat','me-','murid dengan memberikan bantuan awal.',[],{pieces:['me','ra','wat']}),
  row('bantu','membantu','mem-','warga emas.',[],{pieces:['mem','ban','tu']}),
  row('ukur','mengukur','meng-','kotak.',[],{pieces:['me','ngu','kur']}),
  row('simpan','menyimpan','meny-','buku.',[],{pieces:['me','nyim','pan']}),
  row('cas','mengecas','menge-','radio komunikasi.',[],{pieces:['me','nge','cas']})
 ],
 [
  row('lawat','melawat','me-','sekolah.',['melawat','merawat','melompat','melukis']),
  row('jaga','menjaga','men-','pintu masuk.',['mencari','mencatat','menjaga','mendengar']),
  row('kawal','mengawal','meng-','lalu lintas.',['menggali','mengukur','mengira','mengawal']),
  row('siram','menyiram','meny-','pokok bunga.',['menyapu','menyiram','menyusun','menyimpan']),
  row('pos','mengepos','menge-','surat.',['mengepos','mengecat','mengepam','mengecas'])
 ],
 [
  row('lihat','melihat','me-','peta.',[],{parts:['Anggota polis','melihat','peta.']}),
  row('pilih','memilih','mem-','topi.',[],{parts:['Anggota polis','memilih','topi.']}),
  row('tulis','menulis','men-','laporan.',[],{parts:['Anggota','polis','menulis','laporan.']}),
  row('kira','mengira','meng-','kon trafik.',[],{parts:['Anggota','polis','mengira','kon','trafik.']}),
  row('sapu','menyapu','meny-','lantai.',[],{parts:['Anggota','polis','menyapu','lantai.']})
 ]
];
