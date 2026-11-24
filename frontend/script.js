const API_URL = "http://localhost:3000/api";

async function loadKategori() {

    const kategoriList = document.getElementById('kategori-list');
    if (!kategoriList) return;

    try {
        const response = await fetch(API_URL + '/kategori_alat');
        const result = await response.json();
        console.log(result);
        kategoriList.innerHTML = '';

        if (result.data && result.data.length > 0) {
            result.data.forEach(kategori => {

                const row = `
                <tr class="hover:bg-gray-50 transition-colors">

                <td class="py-4 px-6 font-medium text-gray-900">${kategori.id_kategori}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${kategori.nama_kategori}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${kategori.deskripsi}</td>
                
                </tr>`;
                kategoriList.innerHTML += row;
            });
        } else {
            kategoriList.innerHTML = `
            <tr>
            <td colspan="3" class="py-4 px-6 text-center text-gray-500">Belum ada kategori yang ditambahkan.</td>
            </tr>`;
        }
    } catch (error) {
        console.error('Gagal mengambil data kategori:', error);
        document.getElementById('kategori-list').innerHTML = `
        <tr>
        <td colspan="3" class="py-4 px-6 text-center text-red-500">Gagal memuat data kategori. Pastikan server aktif.</td>
        </tr>`;
    }
}

async function loadAlat() {

    const alatList = document.getElementById('alat-list');
    if (!alatList) return;

    try {
        const response = await fetch(API_URL + '/alat');
        const result = await response.json();
        console.log(result);
        alatList.innerHTML = '';

        if (result.data && result.data.length > 0) {
            result.data.forEach(alat => {

                const row = `
                <tr class="hover:bg-gray-50 transition-colors">
                
                <td class="py-4 px-6 font-medium text-gray-900">${alat.id_alat}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${alat.nama_alat}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${alat.nama_kategori}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${alat.kondisi}</td>
                <td class="py-4 px-6 text-gray-900">${alat.stok}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${alat.lokasi}</td>
                <td class="py-4 px-6 text-center">
                <button onclick="editAlat(${alat.id_alat})" 
                    style="background:#2563eb; color:white; padding:4px 12px; border-radius:6px; margin-right:4px;">Edit</button>
                <button onclick="hapusAlat(${alat.id_alat})" 
                    style="background:#dc2626; color:white; padding:4px 12px; border-radius:6px;">Hapus</button>
                </td>
                
                </tr>`;
                alatList.innerHTML += row;
            });
        } else {
            alatList.innerHTML = `
            <tr>
            <td colspan="7" class="py-4 px-6 text-center text-gray-500">Belum ada alat yang ditambahkan.</td>
            </tr>`;
        }
    } catch (error) {
        console.error('Gagal mengambil data alat:', error);
        document.getElementById('alat-list').innerHTML = `
        <tr>
        <td colspan="6" class="py-4 px-6 text-center text-red-500">Gagal memuat data alat. Pastikan server aktif.</td>
        </tr>`;
    }
}

async function hapusAlat(id) {
    if (!confirm('Yakin mau hapus alat dengan ID ' + id + '?')) return;

    try {
        const response = await fetch(API_URL + '/alat/' + id, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (response.ok) {
            alert('Berhasil dihapus');
            loadAlat();
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Gagal konek ke server');
    }
}

async function editAlat(id) {
    console.log('Edit diklik:', id);
    try {
        await loadCategoryEdit();

        const res = await fetch(API_URL + '/alat/' + id);
        const hasil = await res.json();
        console.log('Hasil dari backend:', hasil);

        if (!hasil.data) {
            alert('Gagal ambil data: ' + hasil.message);
            return;
        }

        const d = hasil.data;
        document.getElementById('edit-id').value = d.id_alat;
        document.getElementById('edit-id_kategori').value = d.id_kategori;
        document.getElementById('edit-nama').value = d.nama_alat;
        document.getElementById('edit-kondisi').value = d.kondisi;
        document.getElementById('edit-stok').value = d.stok;
        document.getElementById('edit-lokasi').value = d.lokasi;

        document.getElementById('modeEdit').style.display = 'flex';
    } catch (e) {
        console.error(e);
        alert('Error di editAlat, cek Console (F12): ' + e.message);
    }
}

function tutupEdit() {
    document.getElementById('modeEdit').style.display = 'none';
}

async function simpanEditAlat() {
    const id = document.getElementById('edit-id').value;

    const response = await fetch(API_URL + '/alat/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_kategori: Number(document.getElementById('edit-id_kategori').value),
            nama_alat: document.getElementById('edit-nama').value,
            kondisi: document.getElementById('edit-kondisi').value,
            stok: Number(document.getElementById('edit-stok').value),
            lokasi: document.getElementById('edit-lokasi').value
        })
    });

    const result = await response.json();

    if (response.ok) { 
        alert(result.message); 
        
        tutupEdit();
        loadAlat();

    } else { 
        alert(result.message);
    } 
}

async function loadPeminjaman() {

    const peminjamanList = document.getElementById('peminjaman-list');
    if (!peminjamanList) return;

    try {
        const response = await fetch(API_URL + '/peminjaman');
        const result = await response.json();
        console.log(result);
        peminjamanList.innerHTML = '';

        if (result.data && result.data.length > 0) {
            result.data.forEach(peminjaman => {

                const row = `
                <tr class="hover:bg-gray-50 transition-colors">

                <td class="py-4 px-6 font-medium text-gray-900">${peminjaman.id_peminjaman}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${peminjaman.nama_alat}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${peminjaman.nama_peminjam}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${peminjaman.kelas}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${peminjaman.tanggal_pinjam.slice(0,10)}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${peminjaman.tanggal_kembali ? peminjaman.tanggal_kembali.slice(0,10) : '-'}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${peminjaman.jumlah}</td>
                <td class="py-4 px-6 font-medium text-gray-900">${peminjaman.status}</td>
                <td class="px-4 px-6 text-center">
                <button onclick="editPeminjaman(${peminjaman.id_peminjaman})" style="background:#2563eb; color:white; padding:4px 12px; border-radius:6px; margin-right:4px">Edit</button>
                </td>

                </tr>`;
                peminjamanList.innerHTML += row;
            });
        } else {
            peminjamanList.innerHTML = `
            <tr>
            <td colspan="9" class="py-4 px-6 text-center text-gray-500">Belum ada peminjaman yang ditambahkan.</td>
            </tr>`;
        }
    } catch (error) {
        console.error('Gagal mengambil data peminjaman:', error);
        document.getElementById('peminjaman-list').innerHTML = `
        <tr>
        <td colspan="8" class="py-4 px-6 text-center text-red-500">Gagal memuat data peminjaman. Pastikan server aktif.</td>
        </tr>`;
    }
}

async function editPeminjaman(id) {
    try {
        await loadToolsEdit();

        const res = await fetch(API_URL + '/peminjaman/' + id);
        const hasil = await res.json();
        console.log('Hasil peminjaman:', hasil);

        if (!hasil.data) {
            alert('Gagal ambil data: ' + hasil.message);
            return;
        }

        const d = hasil.data;
        document.getElementById('edit-id').value = d.id_peminjaman;
        document.getElementById('edit-id_alat').value = d.id_alat; // <-- sekarang ketemu!
        document.getElementById('edit-nama').value = d.nama_peminjam;
        document.getElementById('edit-kelas').value = d.kelas;
        document.getElementById('edit-tanggal-pinjam').value = d.tanggal_pinjam ? d.tanggal_pinjam.slice(0, 10) : '';
        document.getElementById('edit-tanggal-kembali').value = d.tanggal_kembali ? d.tanggal_kembali.slice(0, 10) : '';
        document.getElementById('edit-jumlah').value = d.jumlah;
        document.getElementById('edit-status').value = d.status;

        document.getElementById('modeEdit').style.display = 'flex';
    } catch (e) {
        console.error(e);
        alert('Error di editPeminjaman: ' + e.message);
    }
}

function tutupEdit() {
    document.getElementById('modeEdit').style.display = 'none';
}

async function simpanEditPeminjaman() {
    const id = document.getElementById('edit-id').value;

    const response = await fetch(API_URL + '/peminjaman/' + id, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_alat: Number(document.getElementById('edit-id_alat').value),
            nama_peminjam: document.getElementById('edit-nama').value,
            kelas: document.getElementById('edit-kelas').value,
            tanggal_pinjam: document.getElementById('edit-tanggal-pinjam').value,
            tanggal_kembali: document.getElementById('edit-tanggal-kembali').value,
            jumlah: Number(document.getElementById('edit-jumlah').value),
            status: document.getElementById('edit-status').value
        })
    });

    const result = await response.json(); 

    if (response.ok) {
        alert(result.message);
        
        tutupEdit();
        loadPeminjaman();

    } else {
        alert(result.message); 
    }
}

async function loadCategory() {

    const kategoriSelect = document.getElementById('id_kategori');
    if (!kategoriSelect) return;

    try {
        const response = await fetch(API_URL + '/kategori_alat');
        const result = await response.json();
        kategoriSelect.innerHTML = '<option value="" disabled selected>--Pilih Kategori--</option > ';
        result.data.forEach(kategori => {
            const option = document.createElement('option');
            option.value = kategori.id_kategori;
            option.textContent = kategori.nama_kategori;
            kategoriSelect.appendChild(option);
        });
    } catch (error) {
        document.getElementById('id_kategori').innerHTML = `< option value="" disabled > Gagal memuat kategori</option >`;
    }
}

async function loadTools() {
    const kategoriSelect = document.getElementById('id_alat');
    if (!kategoriSelect) return;

    try {
        const response = await fetch(API_URL + '/alat');
        const result = await response.json();
        kategoriSelect.innerHTML = '<option value="" disabled selected>--Pilih Alat--</option>';
        result.data.forEach(alat => {
            const option = document.createElement('option');
            option.value = alat.id_alat;
            option.textContent = alat.nama_alat;
            kategoriSelect.appendChild(option);
        });
    } catch (error) {
        kategoriSelect.innerHTML = `<option value="" disabled>Gagal memuat alat</option>`;
    }
}

async function loadCategoryEdit() {
    const select = document.getElementById('edit-id_kategori');
    if (!select) return;
    try {
        const response = await fetch(API_URL + '/kategori_alat');
        const result = await response.json();
        select.innerHTML = '<option value="" disabled selected>--Pilih Kategori--</option>';
        result.data.forEach(kategori => {
            const option = document.createElement('option');
            option.value = kategori.id_kategori;
            option.textContent = kategori.nama_kategori;
            select.appendChild(option);
        });
    } catch (error) {
        select.innerHTML = '<option value="" disabled>Gagal memuat kategori</option>';
    }
}

async function loadToolsEdit() {
    const select = document.getElementById('edit-id_alat');
    if (!select) return;
    try {
        const response = await fetch(API_URL + '/alat');
        const result = await response.json();
        select.innerHTML = '<option value="" disabled>--Pilih Alat--</option>';
        result.data.forEach(alat => {
            const option = document.createElement('option');
            option.value = alat.id_alat;
            option.textContent = alat.nama_alat;
            select.appendChild(option);
        });
    } catch (error) {
        select.innerHTML = '<option value="" disabled>Gagal memuat alat</option>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadKategori();
    loadAlat();
    loadPeminjaman();
    loadCategory();
    loadTools();
    loadCategoryEdit();
    loadToolsEdit();
});

const formTambahAlat = document.getElementById('form-tambah-alat');
const messageArea = document.getElementById('message-area');

if (formTambahAlat) {
    formTambahAlat.addEventListener('submit', async function (event) {
    event.preventDefault(); // Mencegah browser reload halaman

    const tambahAlatData = {
        id_kategori: Number(document.getElementById('id_kategori').value),
        nama_alat: document.getElementById('nama_alat').value,
        kondisi: document.getElementById('kondisi').value,
        stok: Number(document.getElementById('stok').value),
        lokasi: document.getElementById('lokasi').value
    };
    if (!tambahAlatData.id_kategori) {
        alert("Pilih kategori terlebih dahulu!");
        return;
    }
    try {
        const response = await fetch(API_URL + '/alat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tambahAlatData)
        });
        const result = await response.json();

        if (response.status === 201) {
            messageArea.innerHTML = `<p style="color: green; padding: 10px; font-weight: bold;">Berhasil: ${result.message}</p>`;
            formTambahAlat.reset(); // Kosongkan input form
            setTimeout(() => { messageArea.innerHTML = ''; }, 2000);
            return; // PERBARUI TABEL OTOMATIS TANPA F5!
            
        } else {
            messageArea.innerHTML = `<p style="color: red;">Gagal: ${result.message}</p>`;
        }
    } catch (error) {
        messageArea.innerHTML = `<p style="color: red;">Koneksi gagal. Pastikan backend aktif.</p>`;
    }
});
}

const formTambahPeminjaman = document.getElementById('form-tambah-peminjaman');
const messageArea2 = document.getElementById('message-area2');

if (formTambahPeminjaman) {
    formTambahPeminjaman.addEventListener('submit', async function (event) {
    event.preventDefault(); // Mencegah browser reload halaman

    const tambahPeminjamanData = {
        id_alat: Number(document.getElementById('id_alat').value),
        nama_peminjam: document.getElementById('nama_peminjam').value,
        kelas: document.getElementById('kelas').value,
        tanggal_pinjam: document.getElementById('tanggal_pinjam').value,
        tanggal_kembali: document.getElementById('tanggal_kembali').value === '' ? null : document.getElementById('tanggal_kembali').value,
        jumlah: Number(document.getElementById('jumlah').value),
        status: document.getElementById('status').value
    };
    console.log(tambahPeminjamanData);
    if (!tambahPeminjamanData.id_alat) {
        alert("Pilih alat terlebih dahulu!");
        return;
    }
    try {
        const response = await fetch(API_URL + '/peminjaman', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tambahPeminjamanData)
        });
        const result = await response.json();

        if (response.status === 201) {
            messageArea2.innerHTML = `<p style="color: green; padding: 10px; font-weight: bold;">Berhasil: ${result.message}</p>`;
            formTambahPeminjaman.reset(); // Kosongkan input form
            setTimeout(() => { messageArea2.innerHTML = ''; }, 2000);
            return;

        } else {
            messageArea2.innerHTML = `<p style="color: red;">Gagal: ${result.message}</p>`;
        }

    } catch (error) {
        messageArea2.innerHTML = `<p style="color: red;">Koneksi gagal. Pastikan backend aktif.</p>`;
    }
});
}
