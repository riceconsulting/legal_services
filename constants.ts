
import type { Document } from './types';

const SAMPLE_DOCUMENT_CONTENT_1 = `PERJANJIAN KERJASAMA PEMASARAN

Nomor: 001/PKS-MARKETING/XYZ/V/2024

Perjanjian Kerjasama Pemasaran ini (selanjutnya disebut "Perjanjian") dibuat dan ditandatangani di Jakarta pada hari Senin, tanggal Dua Puluh Tujuh (27) bulan Mei tahun Dua Ribu Dua Puluh Empat (2024), oleh dan antara:

1.  PT INOVASI DIGITAL PERKASA, sebuah perseroan terbatas yang didirikan dan tunduk pada hukum negara Republik Indonesia, berkedudukan di Jakarta Selatan, dalam hal ini diwakili oleh Budi Santoso selaku Direktur Utama (selanjutnya disebut "PIHAK PERTAMA").

2.  CV KARYA MAJU BERSAMA, sebuah persekutuan komanditer yang didirikan dan tunduk pada hukum negara Republik Indonesia, berkedudukan di Bandung, dalam hal ini diwakili oleh Citra Lestari selaku Direktur (selanjutnya disebut "PIHAK KEDUA").

PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut "Para Pihak".

PASAL 1
MAKSUD DAN TUJUAN

PIHAK PERTAMA adalah perusahaan yang bergerak di bidang pengembangan perangkat lunak, khususnya aplikasi manajemen inventaris "StokPintar".
PIHAK KEDUA adalah perusahaan yang memiliki keahlian dan jaringan di bidang pemasaran produk digital.
Para Pihak sepakat untuk menjalin kerjasama dalam memasarkan dan menjual produk StokPintar milik PIHAK PERTAMA kepada calon pelanggan di wilayah Jawa Barat.

PASAL 2
RUANG LINGKUP

Ruang lingkup kerjasama ini meliputi:
1.  PIHAK KEDUA berhak untuk melakukan kegiatan promosi, presentasi, dan negosiasi penjualan produk StokPintar.
2.  PIHAK PERTAMA akan menyediakan materi pemasaran, pelatihan produk, dan dukungan teknis yang diperlukan oleh PIHAK KEDUA.
3.  PIHAK PERTAMA bertanggung jawab atas instalasi, pemeliharaan, dan layanan purna jual kepada pelanggan yang diperoleh PIHAK KEDUA.

PASAL 3
HAK DAN KEWAJIBAN

A. Hak dan Kewajiban PIHAK PERTAMA:
   1. Berhak menerima pembayaran atas penjualan produk StokPintar sesuai dengan ketentuan dalam Perjanjian ini.
   2. Wajib memberikan komisi penjualan kepada PIHAK KEDUA.
   3. Wajib memberikan dukungan teknis dan non-teknis kepada PIHAK KEDUA.

B. Hak dan Kewajiban PIHAK KEDUA:
   1. Berhak mendapatkan komisi atas setiap penjualan produk StokPintar yang berhasil dilakukan.
   2. Wajib melakukan upaya pemasaran terbaik untuk mencapai target penjualan.
   3. Wajib menjaga nama baik PIHAK PERTAMA dan produk StokPintar.

PASAL 4
KOMISI PENJUALAN

PIHAK PERTAMA akan memberikan komisi sebesar 15% (lima belas persen) dari nilai kontrak bersih (setelah dikurangi pajak) untuk setiap penjualan yang berhasil dilakukan oleh PIHAK KEDUA. Pembayaran komisi akan dilakukan paling lambat 14 (empat belas) hari kerja setelah PIHAK PERTAMA menerima pembayaran penuh dari pelanggan.

PASAL 5
JANGKA WAKTU

Perjanjian ini berlaku selama 1 (satu) tahun terhitung sejak tanggal penandatanganan dan dapat diperpanjang berdasarkan kesepakatan tertulis dari Para Pihak.

PASAL 6
KERAHASIAAN

PIHAK KEDUA setuju untuk tidak mengungkapkan informasi rahasia apapun milik PIHAK PERTAMA kepada pihak ketiga manapun tanpa persetujuan tertulis terlebih dahulu dari PIHAK PERTAMA.

PASAL 7
PENYELESAIAN PERSELISIHAN

Segala perselisihan yang timbul dari Perjanjian ini akan diselesaikan secara musyawarah untuk mufakat. Apabila musyawarah tidak mencapai mufakat, maka Para Pihak sepakat untuk menyelesaikannya melalui Pengadilan Negeri Jakarta Selatan.

PASAL 8
FORCE MAJEURE

Tidak ada pihak yang akan bertanggung jawab atas kegagalan atau keterlambatan dalam pelaksanaan kewajibannya berdasarkan Perjanjian ini jika disebabkan oleh kejadian di luar kendali yang wajar (Force Majeure), seperti bencana alam, perang, atau peraturan pemerintah.

Demikian Perjanjian ini dibuat dalam rangkap 2 (dua), masing-masing bermeterai cukup dan memiliki kekuatan hukum yang sama.

PIHAK PERTAMA
PT INOVASI DIGITAL PERKASA

(Budi Santoso)
Direktur Utama

PIHAK KEDUA
CV KARYA MAJU BERSAMA

(Citra Lestari)
Direktur
`;


const SAMPLE_DOCUMENT_CONTENT_2 = `SURAT KUASA KHUSUS
Nomor: 123/SKK/ADV/VI/2024

Yang bertanda tangan di bawah ini:
Nama           : ANDI WIJAYA
Pekerjaan      : Wiraswasta
Alamat         : Jl. Merdeka No. 45, Jakarta Pusat
Dalam hal ini memilih domisili hukum di kantor kuasanya yang akan disebut di bawah ini, selanjutnya disebut sebagai PEMBERI KUASA.

Dengan ini memberikan kuasa penuh kepada:
Nama           : RAHMAT HIDAYAT, S.H., M.H.
Pekerjaan      : Advokat
Alamat         : Kantor Hukum Rahmat & Rekan, Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan
Selanjutnya disebut sebagai PENERIMA KUASA.

-------------------------------------------KHUSUS-------------------------------------------

Untuk dan atas nama Pemberi Kuasa, mendampingi, mewakili, serta membela hak-hak dan kepentingan hukum Pemberi Kuasa sehubungan dengan adanya Gugatan Wanprestasi yang diajukan oleh PT. Bangun Sejahtera dengan perkara Nomor 789/Pdt.G/2024/PN.Jkt.Pst di Pengadilan Negeri Jakarta Pusat.

Untuk itu, Penerima Kuasa berhak untuk:
1. Menghadap di muka Pengadilan Negeri, Pengadilan Tinggi, Mahkamah Agung Republik Indonesia, serta lembaga peradilan lainnya.
2. Menghadap pejabat-pejabat, instansi-instansi pemerintah maupun swasta.
3. Mengajukan dan menandatangani surat-surat, permohonan, gugatan, jawaban, replik, duplik, kesimpulan, memori banding, memori kasasi, dan kontra memori.
4. Mengajukan saksi-saksi dan bukti-bukti, serta menolak saksi dan bukti lawan.
5. Menerima dan melakukan pembayaran, serta memberikan kuitansi atau tanda terima.
6. Melakukan segala tindakan hukum yang dianggap perlu dan berguna bagi kepentingan Pemberi Kuasa, termasuk upaya perdamaian (dading).

Kuasa ini diberikan dengan hak substitusi.

Demikian Surat Kuasa Khusus ini dibuat untuk dapat dipergunakan sebagaimana mestinya.

Jakarta, 10 Juni 2024

Penerima Kuasa,                                  Pemberi Kuasa,

(Rahmat Hidayat, S.H., M.H.)                      (Andi Wijaya)
`;

const SAMPLE_DOCUMENT_CONTENT_3 = `AKTA JUAL BELI
Nomor: 50/2024

Pada hari ini, Rabu, tanggal dua belas (12) bulan Juni tahun dua ribu dua puluh empat (2024), menghadap kepada saya, Dr. INDAH PURNAMASARI, S.H., M.Kn., Notaris di Kota Depok, dengan dihadiri oleh saksi-saksi yang akan disebut pada bagian akhir akta ini:

I. Tuan AGUS SALIM, lahir di Cirebon, pada tanggal 15-08-1980 (lima belas Agustus seribu sembilan ratus delapan puluh), Warga Negara Indonesia, swasta, bertempat tinggal di Kota Depok, Jalan Mawar Nomor 10, RT 001, RW 005, Kelurahan Pancoran Mas, Kecamatan Pancoran Mas, pemegang Kartu Tanda Penduduk nomor 3276011508800001.
- selanjutnya disebut PIHAK PERTAMA (Penjual).

II. Nyonya SITI AMINAH, lahir di Surabaya, pada tanggal 20-04-1985 (dua puluh April seribu sembilan ratus delapan puluh lima), Warga Negara Indonesia, Ibu Rumah Tangga, bertempat tinggal di Kota Depok, Jalan Kenanga Nomor 25, RT 003, RW 007, Kelurahan Beji, Kecamatan Beji, pemegang Kartu Tanda Penduduk nomor 3276022004850002.
- selanjutnya disebut PIHAK KEDUA (Pembeli).

Para penghadap telah saya, Notaris, kenal.

PIHAK PERTAMA dengan ini menerangkan menjual dan menyerahkan kepada PIHAK KEDUA, dan PIHAK KEDUA menerangkan membeli dan menerima penyerahan dari PIHAK PERTAMA berupa:
Sebidang tanah Hak Milik Nomor 250/Pancoran Mas, seluas 200 m2 (dua ratus meter persegi) dengan Surat Ukur tanggal 10-01-2010 Nomor 05/2010, yang terletak di Provinsi Jawa Barat, Kota Depok, Kecamatan Pancoran Mas, Kelurahan Pancoran Mas, sebagaimana diuraikan dalam Sertipikat (Tanda Bukti Hak) yang dikeluarkan oleh Kepala Kantor Pertanahan Kota Depok tanggal 15 Maret 2010.

Jual beli ini dilangsungkan dengan harga sebesar Rp 500.000.000,- (lima ratus juta rupiah), jumlah uang mana telah dibayar lunas oleh PIHAK KEDUA kepada PIHAK PERTAMA sebelum penandatanganan akta ini.

Pasal-pasal lainnya mengenai jaminan, penyerahan, dan lain-lain disetujui oleh kedua belah pihak sesuai ketentuan undang-undang yang berlaku.

Demikian akta ini dibuat di Depok, pada hari dan tanggal tersebut di atas, dengan dihadiri oleh Tuan Budi dan Tuan Candra sebagai saksi-saksi.

PIHAK KEDUA                                     PIHAK PERTAMA
(Siti Aminah)                                   (Agus Salim)

SAKSI-SAKSI
(Budi)                                          (Candra)

NOTARIS
(Dr. Indah Purnamasari, S.H., M.Kn.)
`;

const SAMPLE_DOCUMENT_CONTENT_4 = `PUTUSAN
Nomor 15/Pdt.G.S/2024/PN SBY

DEMI KEADILAN BERDASARKAN KETUHANAN YANG MAHA ESA

Pengadilan Negeri Surabaya yang memeriksa dan memutus perkara perdata pada tingkat pertama dalam persidangan majelis hakim, telah menjatuhkan putusan sebagai berikut dalam perkara gugatan sederhana antara:

PENGGUGAT:
Nama        : PT. MAKMUR JAYA, berkedudukan di Surabaya, diwakili oleh Direkturnya, Bapak Heru Purnomo.
Alamat      : Jl. Pahlawan No. 1, Surabaya.

TERGUGAT:
Nama        : UD. SENTOSA ABADI, berkedudukan di Surabaya.
Alamat      : Jl. Diponegoro No. 100, Surabaya.

TENTANG DUDUK PERKARA:
Menimbang, bahwa Penggugat dengan surat gugatannya tanggal 2 Januari 2024 yang diterima dan didaftarkan di Kepaniteraan Pengadilan Negeri Surabaya pada tanggal 3 Januari 2024 dalam Register Nomor 15/Pdt.G.S/2024/PN SBY, telah mengajukan gugatan terhadap Tergugat dengan dalil-dalil pada pokoknya sebagai berikut:
1. Bahwa antara Penggugat dan Tergugat telah terjalin hubungan jual beli barang berupa bahan bangunan.
2. Bahwa Tergugat telah melakukan pemesanan barang kepada Penggugat sesuai Invoice No. INV/MJ/XII/2023 tertanggal 1 Desember 2023 senilai Rp 25.000.000,- (dua puluh lima juta rupiah) yang seharusnya dilunasi pada tanggal 30 Desember 2023.
3. Bahwa hingga gugatan ini diajukan, Tergugat belum melakukan pembayaran sama sekali (wanprestasi).

TENTANG PERTIMBANGAN HUKUM:
Menimbang, bahwa berdasarkan bukti-bukti yang diajukan Penggugat (bukti P-1 berupa Invoice) dan keterangan saksi, Majelis Hakim berpendapat bahwa dalil-dalil Penggugat beralasan hukum dan patut untuk dikabulkan.

MENGADILI:
1. Mengabulkan gugatan Penggugat untuk seluruhnya.
2. Menyatakan Tergugat telah melakukan wanprestasi.
3. Menghukum Tergugat untuk membayar lunas utangnya kepada Penggugat sebesar Rp 25.000.000,- (dua puluh lima juta rupiah) secara seketika dan sekaligus.
4. Menghukum Tergugat untuk membayar biaya perkara sejumlah Rp 350.000,- (tiga ratus lima puluh ribu rupiah).

Demikian diputuskan dalam rapat permusyawaratan Majelis Hakim Pengadilan Negeri Surabaya pada hari Selasa, 25 Juni 2024.

HAKIM KETUA,
(ttd)
Dr. SUTANTO, S.H., M.H.
`;

export const MOCK_DOCUMENTS: Document[] = [
    {
        id: 'doc-sample-4',
        name: '[SAMPLE] Putusan Pengadilan Negeri.txt',
        type: 'Putusan Pengadilan',
        versions: [
            {
                version: 1,
                date: '2024-06-25',
                content: SAMPLE_DOCUMENT_CONTENT_4
            }
        ],
        draftContent: null,
    },
    {
        id: 'doc-sample-3',
        name: '[SAMPLE] Akta Jual Beli Tanah.txt',
        type: 'Akta Jual Beli',
        versions: [
            {
                version: 1,
                date: '2024-06-12',
                content: SAMPLE_DOCUMENT_CONTENT_3
            }
        ],
        draftContent: null,
    },
    {
        id: 'doc-sample-2',
        name: '[SAMPLE] Surat Kuasa Khusus.txt',
        type: 'Surat Kuasa',
        versions: [
            {
                version: 1,
                date: '2024-06-10',
                content: SAMPLE_DOCUMENT_CONTENT_2
            }
        ],
        draftContent: null,
    },
    {
        id: 'doc-sample-1',
        name: '[SAMPLE] Perjanjian Kerjasama Pemasaran.txt',
        type: 'Perjanjian Kerjasama',
        versions: [
            {
                version: 1,
                date: '2024-05-27',
                content: SAMPLE_DOCUMENT_CONTENT_1
            }
        ],
        draftContent: null,
    }
];
