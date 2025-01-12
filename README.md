# School Attendance Management System

Proyek ini adalah sistem manajemen absensi sekolah sederhana yang dibangun menggunakan MySQL sebagai database, PHP Native untuk backend API, dan ReactJS (dengan Vite, TypeScript, ShadCN UI, dan TailwindCSS) untuk frontend. Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

---

## 1. Buat Database

Buat database bernama `school_attendance` menggunakan perintah SQL berikut:

```sql
CREATE DATABASE school_attendance;
```

### 2. Buat Tabel

Buat tabel `attendance` di dalam database `school_attendance` untuk menyimpan data absensi:

```sql
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL,
    date DATE NOT NULL
);
```

### 3. Tambahkan Data Dummy (Opsional)

Tambahkan data dummy untuk keperluan pengujian:

```sql
INSERT INTO attendance (student_name, status, date) VALUES
('John Doe', 'Present', '2025-01-10'),
('Jane Smith', 'Late', '2025-01-11'),
('Alice Johnson', 'Absent', '2025-01-12'),
('Bob Williams', 'Present', '2025-01-13'),
('Emma Brown', 'Late', '2025-01-14');
```

---

## 4. Buat Backend API

### Langkah-langkah:

Unduh file koneksi.php dari folder backend di repository ini, kemudian ikuti langkah-langkah berikut:

1. Pindahkan file tersebut ke folder xampp\htdocs di komputer Anda.
2. Buat folder baru bernama school_attendance di dalam xampp\htdocs.
3. Letakkan file koneksi.php di dalam folder school_attendance untuk menghubungkan proyek ke database.
4. Jalankan XAMPP, lalu aktifkan Apache dan MySQL.

---

## 5. Buat Frontend

### Langkah-langkah:

1. Clone repository atau unduh file proyek.
2. Pindah ke direktori proyek, lalu jalankan perintah berikut untuk menginstal dependensi:

```bash
npm install
```

3. Untuk menjalankan server development, gunakan perintah berikut:

```bash
npm run dev
```

4. Buka aplikasi Anda di browser melalui URL berikut:

```
http://localhost:5173
```
atau URL lain yang diberikan setelah server berjalan.




