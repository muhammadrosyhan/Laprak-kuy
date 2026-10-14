export type ImageItem = {
  id: string;
  dataUrl: string;
  name: string;
  caption: string;
};
export type Practical = {
  id: string;
  title: string;
  steps: string[];
  images: ImageItem[];
  explanation: string;
};
export type Report = {
  id: string;
  course: string;
  topic: string;
  meeting: string;
  date: string;
  session: string;
  objective: string;
  pretest: string;
  pretestImages: ImageItem[];
  tools: string[];
  practicals: Practical[];
  analysis: string;
  posttest: string;
  posttestImages: ImageItem[];
  posttestExplanation?: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "done";
};
export type Profile = {
  name: string;
  nim: string;
  study: string;
  faculty: string;
  university: string;
  year: string;
};
export const initialProfile: Profile = {
  name: "",
  nim: "",
  study: "S1 Informatika",
  faculty: "Fakultas Teknologi Industri",
  university: "Universitas Ahmad Dahlan",
  year: "2026",
};
export const uid = () => Math.random().toString(36).slice(2, 10);
export const freshPractical = (n: number): Practical => ({
  id: uid(),
  title: `Praktikum ${n}`,
  steps: [""],
  images: [],
  explanation: "",
});
export const sampleReport = (): Report => ({
  id: uid(),
  course: "Algoritma Pemrograman",
  topic: "Perulangan",
  meeting: "4",
  date: "2026-04-30",
  session: "Kamis, 07.00–10.00 WIB",
  objective:
    "Memahami penggunaan perulangan for, while, dan do-while dalam bahasa C++.",
  pretest:
    "Buatlah algoritma menghitung nilai x pangkat y, dengan x bilangan real dan y bilangan bulat positif atau negatif.",
  pretestImages: [],
  tools: ["Laptop / PC", "Dev-C++"],
  practicals: [
    {
      id: uid(),
      title: "Praktikum 1 — Perpangkatan",
      steps: [
        "Buka aplikasi Dev-C++.",
        "Buat file baru dan tambahkan library iostream.",
        "Buat fungsi main() dan deklarasikan variabel.",
        "Gunakan percabangan if-else dan perulangan for.",
        "Compile & Run, lalu uji beberapa input.",
      ],
      images: [],
      explanation:
        "Program menghitung hasil perpangkatan dengan menangani pangkat positif, nol, dan negatif.",
    },
    {
      id: uid(),
      title: "Praktikum 2 — Perulangan While",
      steps: [
        "Buat class dan deklarasikan variabel batas.",
        "Buat fungsi input() dan proses() dengan while.",
        "Tampilkan angka dari 1 sampai batas input.",
        "Compile & Run dan periksa output.",
      ],
      images: [],
      explanation:
        "Program menggunakan while untuk menampilkan angka sesuai batas yang diberikan pengguna.",
    },
    {
      id: uid(),
      title: "Praktikum 3 — Menu Do-While",
      steps: [
        "Buat class dan fungsi untuk menampilkan menu.",
        "Gunakan do-while agar menu tampil berulang.",
        "Input pilihan, proses menggunakan if-else, dan berhenti saat memilih 0.",
        "Compile & Run untuk menguji setiap pilihan.",
      ],
      images: [],
      explanation:
        "Perulangan do-while menjaga menu terus ditampilkan hingga pengguna memasukkan angka 0.",
    },
  ],
  analysis:
    "Ketiga program menunjukkan penerapan percabangan dan perulangan untuk menyelesaikan persoalan yang berbeda.",
  posttest:
    "Buat program menghitung pengeluaran dan tabungan bulanan menggunakan menu do-while.",
  posttestImages: [],
  posttestExplanation:
    "Program post test digunakan untuk menghitung pengeluaran dan tabungan bulanan.",
  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
