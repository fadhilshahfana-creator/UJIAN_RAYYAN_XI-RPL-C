const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err)
    return res.status(400).json({ message: 'Data produk tidak valid' });
  next();
})
const HOST = 'localhost'
const PORT = 3000;

// API ALAT
app.get('/api/alat', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*,
              k.nama_kategori 
        FROM alat a
        LEFT JOIN kategori_alat k ON k.id_kategori = a.id_kategori
        ORDER BY a.id_alat`
    );

    res.status(200).json({
      data: result.rows
    });
  } catch (error) {
    console.error('Gagal mengambil seluruh data Alat:', error.message);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data Alat'
    });
  }
});

// MENGAMBIL SATU ALAT BERDASARKAN ID
app.get('/api/alat/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID Alat harus berupa bilangan bulat positif'
    });
  }

  try {
    const result = await pool.query(
      `SELECT a.*,
              k.nama_kategori 
        FROM alat a
        LEFT JOIN kategori_alat k ON k.id_kategori = a.id_kategori
        WHERE a.id_alat = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Data Alat tidak ditemukan'
      });
    }

    res.status(200).json({
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Gagal mengambil data Alat:', error.message);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data Alat'
    });
  }
});

// MENAMBAH ALAT BARU
app.post('/api/alat', async (req, res) => {
  const { id_kategori, nama_alat, kondisi, stok, lokasi } = req.body;

  if (!nama_alat || stok != null && stok < 0) {
    return res.status(400).json({
      message: 'Data Alat tidak valid'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO alat
      (id_kategori, nama_alat, kondisi, stok, lokasi)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        id_kategori,
        nama_alat.trim(),
        kondisi ? kondisi.trim() : null,
        stok ?? 0,
        lokasi
      ]
    );

    res.status(201).json({
      message: 'Data Alat berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Gagal menambahkan data Alat:', error.message);

    res.status(500).json({
      message: 'Terjadi kesalahan saat menambahkan data Alat'
    });
  }
});

// UPDATE DATA ALAT SESUAI ID
app.put('/api/alat/:id', async (req, res) => {
  const id_alat = Number(req.params.id);
  const { id_kategori, nama_alat, kondisi, stok, lokasi } = req.body;

  if (!Number.isSafeInteger(id_alat) || id_alat <= 0) {
    return res.status(400).json({
      message: 'ID Alat tidak valid'
    });
  }

  try {
    const result = await pool.query(
      `UPDATE alat
      SET id_kategori = $1,
      nama_alat = $2,
      kondisi = $3,
      stok = $4,
      lokasi = $5
      WHERE id_alat = $6
      RETURNING *`,
      [
        id_kategori,
        nama_alat.trim(),
        kondisi ? kondisi.trim() : null,
        stok ?? 0,
        lokasi,
        id_alat
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Data Alat tidak ditemukan'
      });
    }

    res.status(200).json({
      message: 'Data Alat berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Gagal memperbarui data Alat:', error.message);

    res.status(500).json({
      message: 'Terjadi kesalahan saat memperbarui data Alat'
    });
  }
});

// DELETE ALAT
app.delete('/api/alat/:id', async (req, res) => {
  const id_alat = Number(req.params.id);

  if (!Number.isSafeInteger(id_alat) || id_alat <= 0) {
    return res.status(400).json({
      message: 'ID Alat tidak valid'
    });
  }

  try {
    const result = await pool.query(
      'DELETE FROM alat WHERE id_alat = $1',
      [id_alat]
    );

    // ini kuncinya
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Data ALat tidak ditemukan'
      });
    }

    res.status(200).json({
      message: 'Data Alat berhasil dihapus'
    });
  } catch (error) {
    console.error('Gagal menghapus kategori:', error.message);

    if (error.code === '23503') {
      return res.status(409).json({
        message: 'Alat tidak bisa dihapus karena masih ada di data Peminjaman. Hapus data Peminjaman-nya dulu!'
      });
    }

    res.status(500).json({
      message: 'Terjadi kesalahan saat menghapus Alat'
    });
  }
});

// API KATEGORI_ALAT 
app.get('/api/kategori_alat', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM kategori_alat ORDER BY id_kategori'
    );

    res.status(200).json({
      data: result.rows
    });
  } catch (error) {
    console.error('Gagal mengambil seluruh Kategori Alat:', error.message);

    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data Kategori Alat'
    });
  }
});

app.get('/api/kategori_alat/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID kategori harus berupa bilangan bulat positif'
    });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM kategori_alat WHERE id_kategori = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Kategori tidak ditemukan'
      });
    }

    res.status(200).json({
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Gagal mengambil data Kategori Alat:', error.message);

    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data Kategori Alat'
    });
  }
});

// API PEMINJAMAN
app.get('/api/peminjaman', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*,
              a.nama_alat
       FROM peminjaman p
       LEFT JOIN alat a ON a.id_alat = p.id_alat 
       ORDER BY p.id_peminjaman`
    );

    res.status(200).json({
      data: result.rows
    });
  } catch (error) {
    console.error('Gagal mengambil seluruh data Peminjaman:', error.message);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data Peminjaman'
    });
  }
});

app.get('/api/peminjaman/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'ID peminjaman harus berupa bilangan bulat positif'
    });
  }

  try {
    const result = await pool.query(
      `SELECT p.*,
              a.nama_alat
       FROM peminjaman p
       LEFT JOIN alat a ON a.id_alat = p.id_alat
       WHERE p.id_peminjaman = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Peminjaman tidak ditemukan'
      });
    }

    res.status(200).json({
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Gagal mengambil peminjaman:', error.message);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data Peminjaman'
    });
  }
});

app.post('/api/peminjaman', async (req, res) => {
  const { id_peminjaman,id_alat, nama_peminjam, kelas, tanggal_pinjam, tanggal_kembali, jumlah, status } = req.body;

  if (!id_alat || !nama_peminjam || !kelas || !tanggal_pinjam || !status) 
    return res.status(400).json({
      message: 'Data peminjaman tidak valid'
    });
  

  try {
    const result = await pool.query(
      `INSERT INTO peminjaman
      (id_alat, nama_peminjam, kelas, tanggal_kembali, jumlah, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        id_alat,
        nama_peminjam,
        kelas,
        tanggal_kembali,
        jumlah,
        status
      ]
    );

    res.status(201).json({
      message: 'Peminjaman berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Gagal menambahkan peminjaman:', error.message);

    res.status(500).json({
      message: 'Terjadi kesalahan saat menambahkan peminjaman'
    });
  }
});

app.put('/api/peminjaman/:id', async (req, res) => {
  const id_peminjaman = Number(req.params.id);
  const { id_alat, nama_peminjam, kelas, tanggal_kembali, jumlah, status } = req.body;

  if (!Number.isSafeInteger(id_peminjaman) || id_peminjaman <= 0) {
    return res.status(400).json({
      message: 'ID peminjaman tidak valid'
    });
  }

  try {
    const result = await pool.query(
      `UPDATE peminjaman
      SET id_alat = $1,
          nama_peminjam = $2,
          kelas = $3,
          tanggal_kembali = $4,
          jumlah = $5,
          status = $6
      WHERE id_peminjaman = $7
      RETURNING *`,
      [
        id_alat,
        nama_peminjam.trim(),
        kelas.trim(),
        tanggal_kembali,
        jumlah,
        status,
        id_peminjaman
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Peminjaman tidak ditemukan'
      });
    }

    res.status(200).json({
      message: 'Peminjaman berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Gagal memperbarui peminjaman:', error.message);

    res.status(500).json({
      message: 'Terjadi kesalahan saat memperbarui peminjaman'
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
});
