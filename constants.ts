
import type { Document } from './types';

const SAMPLE_DOCUMENT_CONTENT = `PERJANJIAN KERJASAMA PEMASARAN

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

export const MOCK_DOCUMENTS: Document[] = [
    {
        id: 'doc-sample-1',
        name: '[SAMPLE] Perjanjian Kerjasama Pemasaran.txt',
        type: 'Perjanjian Kerjasama',
        versions: [
            {
                version: 1,
                date: '2024-05-27',
                content: SAMPLE_DOCUMENT_CONTENT
            }
        ],
        draftContent: null,
    }
];