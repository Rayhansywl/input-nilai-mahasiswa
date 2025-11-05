import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

/**
 * Validasi input form sebelum simpan
 */
function validasiInput() {
  const nim = document.getElementById("nim")?.value.trim();
  const nama = document.getElementById("nama")?.value.trim();
  const matkul = document.getElementById("matkul")?.value.trim();
  const nilai = document.getElementById("nilai")?.value.trim();

  if (!nim || !nama || !matkul || !nilai) {
    alert("Semua field harus diisi!");
    return false;
  }
  if (Number.isNaN(Number(nilai)) || nilai < 0 || nilai > 100) {
    alert("Nilai harus angka 0–100!");
    return false;
  }
  return true;
}

/**
 * Simpan data ke Firestore
 */
async function simpanData(event) {
  event.preventDefault();
  if (!validasiInput()) return;

  const data = {
    nim: document.getElementById("nim").value.trim(),
    nama: document.getElementById("nama").value.trim(),
    matkul: document.getElementById("matkul").value.trim(),
    nilai: Number(document.getElementById("nilai").value),
    waktu: new Date().toISOString() // untuk urutan
  };

  try {
    await addDoc(collection(db, "nilai_mahasiswa"), data);
    alert("Data berhasil disimpan!");
    document.getElementById("formNilai").reset();
    loadData(); // refresh tabel langsung
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    alert("Terjadi kesalahan saat menyimpan data!");
  }
}

/**
 * Ambil & tampilkan data dari Firestore
 */
async function loadData() {
  const tabel = document.getElementById("tabelData");
  if (!tabel) return;
  tabel.innerHTML = "";

  try {
    let q;
    try {
      q = query(collection(db, "nilai_mahasiswa"), orderBy("waktu", "asc"));
    } catch {
      q = collection(db, "nilai_mahasiswa");
    }

    const snapshot = await getDocs(q);
    let no = 1;

    if (snapshot.empty) {
      tabel.innerHTML = `<tr><td colspan="5">Belum ada data.</td></tr>`;
      return;
    }

    for (const doc of snapshot.docs) {
      const d = doc.data();
      tabel.innerHTML += `
        <tr>
          <td>${no++}</td>
          <td>${d.nama || "-"}</td>
          <td>${d.nim || "-"}</td>
          <td>${d.matkul || "-"}</td>
          <td>${d.nilai ?? "-"}</td>
        </tr>
      `;
    }
  } catch (error) {
    console.error("Gagal memuat data:", error);
    alert("Tidak bisa memuat data dari database. Cek koneksi dan konfigurasi database!");
  }
}

/**
 * Cetak tabel ke PDF (tampilan sama seperti di web)
 */
function cetakPDF() {
  const tabel = document.getElementById("tabelNilai");
  if (!tabel) return;

  const pdfContent = document.createElement("div");
  pdfContent.innerHTML = `
    <h2 style="text-align:center; margin-bottom:25px;">Rekap Nilai Mahasiswa</h2>
    <div style="margin-top:25px;">
      ${tabel.outerHTML}
    </div>
  `;

  // Styling PDF agar belang putih pada baris ganjil dan header hitam
  const style = document.createElement("style");
  style.textContent = `
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 10px 8px;
      text-align: center;
      font-size: 12.5px;
    }
    th {
      background-color: #000;
      color: #fff;
      font-weight: bold;
    }
    tr:nth-child(odd) td {
      background-color: #f8f9fa;
    }
    tr:nth-child(even) td {
      background-color: #fff;
    }
  `;
  pdfContent.appendChild(style);

  const opt = {
    margin: [1, 0.5, 0.8, 0.5],
    filename: "Rekap_Nilai_Mahasiswa.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(pdfContent).save();
}

/**
 * Event listener utama
 */
document.getElementById("formNilai")?.addEventListener("submit", simpanData);
document.getElementById("printPdfBtn")?.addEventListener("click", cetakPDF);
globalThis.addEventListener("DOMContentLoaded", loadData);
