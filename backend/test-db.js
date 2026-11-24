// const pool = require('./db');

// async function testConnection() {
//     try {
//         const result = await pool.query(
//             'SELECT current_database() AS database_name'
//         );

//         console.log('Koneksi database berhasil.');
//         console.log('Database:', result.rows[0].database_name);
//     } catch (error) {
//         console.error('Koneksi database gagal.');
//         console.error(error.message);
//     } finally {
//         await pool.end();
//     }
// }

// testConnection();

const pool = require('./db');

async function testProducts() {
    try {
        const result = await pool.query(
            'SELECT * FROM alat LIMIT 3'
        );

        console.log('Jumlah data yang ditampilkan:', result.rows.length);
        console.table(result.rows);
    } catch (error) {
        console.error('Gagal membaca tabel products.');
        console.error(error.message);
    } finally {
        await pool.end();
    }
}
testProducts();