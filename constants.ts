import type { Document } from './types';

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Perjanjian Jual Beli Properti.pdf',
    type: 'Perjanjian Jual Beli',
    versions: [
      {
        version: 2,
        date: '2024-07-29',
        content: `
PERJANJIAN JUAL BELI (PJB)
Nomor: 123/PJB/VII/2024

Pada hari ini, Selasa, tanggal Dua Puluh Sembilan bulan Juli tahun Dua Ribu Dua Puluh Empat (29-07-2024), kami yang bertanda tangan di bawah ini:

1.  Nama: Budi Santoso
    Alamat: Jl. Merdeka No. 1, Jakarta
    Selanjutnya disebut sebagai PIHAK PERTAMA (Penjual).

2.  Nama: Citra Lestari
    Alamat: Jl. Kemerdekaan No. 2, Jakarta
    Selanjutnya disebut sebagai PIHAK KEDUA (Pembeli).

PASAL 1: OBJEK JUAL BELI
PIHAK PERTAMA dengan ini menjual dan menyerahkan kepada PIHAK KEDUA, dan PIHAK KEDUA membeli dan menerima penyerahan dari PIHAK PERTAMA berupa:
Satu unit properti berupa tanah dan bangunan yang terletak di Jl. Pembangunan No. 10, Jakarta, dengan Sertifikat Hak Milik (SHM) Nomor 001/ABC.

PASAL 2: HARGA
Harga jual beli properti sebagaimana dimaksud dalam Pasal 1 disepakati sebesar Rp 2.100.000.000,- (dua miliar seratus juta Rupiah).

PASAL 3: CARA PEMBAYARAN
Pembayaran dilakukan oleh PIHAK KEDUA kepada PIHAK PERTAMA dalam 2 (dua) tahap:
1. Pembayaran pertama sebagai uang muka sebesar Rp 600.000.000,- (enam ratus juta Rupiah) dibayarkan saat penandatanganan perjanjian ini.
2. Pelunasan sebesar Rp 1.500.000.000,- (satu miliar lima ratus juta Rupiah) akan dibayarkan selambat-lambatnya 30 (tiga puluh) hari kalender setelah penandatanganan Akta Jual Beli (AJB) di hadapan Notaris.

PASAL 4: PENYERAHAN
Penyerahan properti akan dilakukan setelah PIHAK KEDUA melunasi seluruh pembayaran.

PASAL 5: PEMUTUSAN KONTRAK
Apabila PIHAK KEDUA gagal melakukan pelunasan dalam jangka waktu yang ditentukan, maka perjanjian ini batal demi hukum dan uang muka menjadi hak PIHAK PERTAMA sepenuhnya. Periode pemberitahuan untuk pemutusan kontrak adalah 14 hari kerja.

PASAL 6: LAIN-LAIN
Segala sengketa akan diselesaikan melalui musyawarah mufakat.

Demikian Perjanjian ini dibuat dalam rangkap 2 (dua) yang bermeterai cukup dan memiliki kekuatan hukum yang sama.

PIHAK PERTAMA
(Budi Santoso)

PIHAK KEDUA
(Citra Lestari)
    `
      },
      {
        version: 1,
        date: '2024-07-28',
        content: `
PERJANJIAN JUAL BELI (PJB)
Nomor: 123/PJB/VII/2024

Pada hari ini, Senin, tanggal Dua Puluh Delapan bulan Juli tahun Dua Ribu Dua Puluh Empat (28-07-2024), kami yang bertanda tangan di bawah ini:

1.  Nama: Budi Santoso
    Alamat: Jl. Merdeka No. 1, Jakarta
    Selanjutnya disebut sebagai PIHAK PERTAMA (Penjual).

2.  Nama: Citra Lestari
    Alamat: Jl. Kemerdekaan No. 2, Jakarta
    Selanjutnya disebut sebagai PIHAK KEDUA (Pembeli).

PASAL 1: OBJEK JUAL BELI
PIHAK PERTAMA dengan ini menjual dan menyerahkan kepada PIHAK KEDUA, dan PIHAK KEDUA membeli dan menerima penyerahan dari PIHAK PERTAMA berupa:
Satu unit properti berupa tanah dan bangunan yang terletak di Jl. Pembangunan No. 10, Jakarta, dengan Sertifikat Hak Milik (SHM) Nomor 001/ABC.

PASAL 2: HARGA
Harga jual beli properti sebagaimana dimaksud dalam Pasal 1 disepakati sebesar Rp 2.000.000.000,- (dua miliar Rupiah).

PASAL 3: CARA PEMBAYARAN
Pembayaran dilakukan oleh PIHAK KEDUA kepada PIHAK PERTAMA dalam 2 (dua) tahap:
1. Pembayaran pertama sebagai uang muka sebesar Rp 500.000.000,- (lima ratus juta Rupiah) dibayarkan saat penandatanganan perjanjian ini.
2. Pelunasan sebesar Rp 1.500.000.000,- (satu miliar lima ratus juta Rupiah) akan dibayarkan selambat-lambatnya 30 (tiga puluh) hari kalender setelah penandatanganan Akta Jual Beli (AJB) di hadapan Notaris.

PASAL 4: PENYERAHAN
Penyerahan properti akan dilakukan setelah PIHAK KEDUA melunasi seluruh pembayaran.

PASAL 5: PEMUTUSAN KONTRAK
Apabila PIHAK KEDUA gagal melakukan pelunasan dalam jangka waktu yang ditentukan, maka perjanjian ini batal demi hukum dan uang muka menjadi hak PIHAK PERTAMA sepenuhnya. Periode pemberitahuan untuk pemutusan kontrak adalah 14 hari kerja.

Demikian Perjanjian ini dibuat dalam rangkap 2 (dua) yang bermeterai cukup dan memiliki kekuatan hukum yang sama.

PIHAK PERTAMA
(Budi Santoso)

PIHAK KEDUA
(Citra Lestari)
    `
      }
    ]
  },
  {
    id: 'doc-2',
    name: 'Akta Notaris Pendirian PT.pdf',
    type: 'Akta Notaris',
    versions: [{
      version: 1,
      date: '2024-07-25',
      content: 'Konten dokumen akta notaris pendirian PT. RICE JAYA ABADI...',
    }],
    draftContent: 'Ini adalah draf perubahan pada Akta Notaris...',
  },
  {
    id: 'doc-3',
    name: 'Putusan Pengadilan Negeri No. 451.docx',
    type: 'Putusan Pengadilan',
    versions: [{
      version: 1,
      date: '2024-07-22',
      content: 'Konten dokumen putusan pengadilan mengenai sengketa tanah...',
    }],
  },
];