// Mock Data untuk Dashboard
const mockApiData = {
    totalPengguna: 5, // totalBahanAjar dihitung dari length this.stok
    totalTracking: 1, // totalTracking
};

var app = new Vue({
    el: '#app',
    data: {
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        pengirimanList: [
            { kode: "REG", nama: "Reguler (3-5 hari)" },
            { kode: "EXP", nama: "Ekspres (1-2 hari)" }
        ],
        paket: [
            { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
            { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
        ],
        stok: [
            {
                kode: "EKMA4116",
                judul: "Pengantar Manajemen",
                kategori: "MK Wajib",
                upbjj: "Jakarta",
                lokasiRak: "R1-A3",
                harga: 65000,
                qty: 28,
                safety: 20,
                catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
            },
            {
                kode: "EKMA4115",
                judul: "Pengantar Akuntansi",
                kategori: "MK Wajib",
                upbjj: "Jakarta",
                lokasiRak: "R1-A4",
                harga: 60000,
                qty: 7,
                safety: 15,
                catatanHTML: "<strong>Cover baru</strong>"
            },
            {
                kode: "BIOL4201",
                judul: "Biologi Umum (Praktikum)",
                kategori: "Praktikum",
                upbjj: "Surabaya",
                lokasiRak: "R3-B2",
                harga: 80000,
                qty: 12,
                safety: 10,
                catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
            },
            {
                kode: "FISIP4001",
                judul: "Dasar-Dasar Sosiologi",
                kategori: "MK Pilihan",
                upbjj: "Makassar",
                lokasiRak: "R2-C1",
                harga: 55000,
                qty: 2,
                safety: 8,
                catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
            }
        ],
        // Simulasi status DO (opsional fitur Tracking DO)
        tracking: { 
            "DO2025-0001": {
                nim: "123456789",
                nama: "Rina Wulandari",
                status: "Dalam Perjalanan",
                ekspedisi: "JNE",
                tanggalKirim: "2025-08-25",
                paket: "PAKET-UT-001",
                total: 120000,
                perjalanan: [
                    { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
                    { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
                    { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
                ]
            }
        },

        // Data stok.html
        filters: {
            upbjj: '',        // Filter UT-Daerah
            kategori: '',     // Filter Kategori Mata Kuliah
            lowStock: false,  // Stok < Safety Stock
            emptyStock: false // Stok = 0
        },
        sort: {
            key: 'judul',    // Default sort key
            direction: 'asc' // Default sort direction
        },
        newItem: {
            kode: '',
            judul: '',
            kategori: '',
            upbjj: '',
            lokasiRak: '',
            harga: 0,
            qty: 0,
            safety: 0,
            catatanHTML: ''
        },
        editingItem: null,
        detailItem: null,

        // Data Dashboard pada index.html
        userInfo: {
            name: 'Rina Wulandari',
            role: 'UPBJJ-UT',
            location: 'UPBJJ JAKARTA',
        },
        dashboardCards: [
            {
                id: 1,
                title: 'Total Pengguna',
                value: 0,
                colorClass: 'card-green',
                link: ''
            },
            {
                id: 2,
                title: 'Total Bahan Ajar',
                value: 0,
                colorClass: 'card-blue',
                link: 'stok.html'
            },
            {
                id: 3,
                title: 'Total Tracking',
                value: 0,
                colorClass: 'card-yellow',
                link: 'tracking.html'
            },
        ],
    },

    // Computed Properties stok.html
    computed: {
        filteredStok() {
            let tempStok = this.stok;
            // Filter UT-Daerah
            if (this.filters.upbjj) {
                tempStok = tempStok.filter(item => item.upbjj === this.filters.upbjj);
            }
            // Filter Kategori
            if (this.filters.upbjj && this.filters.kategori) {
                tempStok = tempStok.filter(item => item.kategori === this.filters.kategori);
            }
            // Filter Empty Stock
            if (this.filters.lowStock || this.filters.emptyStock) {
                tempStok = tempStok.filter(item => {
                    const isLow = this.filters.lowStock && (item.qty < item.safety);
                    const isEmpty = this.filters.emptyStock && (item.qty === 0);
                    return isLow || isEmpty;
                });
            }
            return tempStok;
        },

        sortedAndFilteredStok() {
            let tempStok = [...this.filteredStok];
            // Logika Sort
            const key = this.sort.key;
            const direction = this.sort.direction === 'asc' ? 1 : -1;

            tempStok.sort((a, b) => {
                const aValue = a[key];
                const bValue = b[key];
                // Pengurutan string (judul)
                if (typeof aValue === 'string') {
                    return aValue.localeCompare(bValue) * direction;
                }
                // Pengurutan numerik (qty, harga)
                if (aValue < bValue) return -1 * direction;
                if (aValue > bValue) return 1 * direction;
                return 0;
            });
            return tempStok;
        }
    },

    // Methods stok.html
    methods: {
        formatRupiah(number) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(number);
        },
        showDetail(item) {
            this.detailItem = { ...item };
        },
        resetFilters() {
            this.filters.upbjj = '';
            this.filters.kategori = '';
            this.filters.lowStock = false;
            this.filters.emptyStock = false;
        },
        resetNewItemForm() {
            this.newItem = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
        },
        addNewStokItem() {
            const newItemToAdd = { ...this.newItem };
            this.stok.push(newItemToAdd);
            alert(`Bahan Ajar "${newItemToAdd.judul}" berhasil ditambahkan.`);
            this.resetNewItemForm();
        },
        editStokItem(item) {
            this.editingItem = { ...item };
        },
        saveEditStokItem() {
            if (!this.editingItem) return;
            const index = this.stok.findIndex(i => i.kode === this.editingItem.kode);
            if (index !== -1) {
                // Menggunakan this.$set untuk Reactivity
                this.$set(this.stok, index, this.editingItem);
                alert(`Perubahan untuk Bahan Ajar "${this.editingItem.judul}" berhasil disimpan.`);
            } else {
                alert("Error: Item tidak ditemukan dalam inventaris.");
            }
            this.editingItem = null; // Reset
        },

        // Fungsi tracking.html
        searchDO(doNumber, resultContainerId) {
            const doData = this.tracking[doNumber];
            const resultContainer = document.getElementById(resultContainerId);

            if (!resultContainer) return;
            resultContainer.innerHTML = '';
            if (!doNumber) {
                resultContainer.innerHTML = '<p class="not-found">Mohon masukkan Nomor Delivery Order.</p>';
                return;
            }
            if (doData) {
                const detailHTML = `
                    <h2>Nomor DO: ${doNumber}</h2>
                    <div class="detail-row">
                        <span class="detail-label">Nama Mahasiswa:</span>
                        <span class="detail-value">${doData.nama}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">NIM:</span>
                        <span class="detail-value">${doData.nim}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status Terkini:</span>
                        <span class="detail-value"><span class="status-badge">${doData.status}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Ekspedisi:</span>
                        <span class="detail-value">${doData.ekspedisi}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal Kirim:</span>
                        <span class="detail-value">${doData.tanggalKirim}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Kode Paket:</span>
                        <span class="detail-value">${doData.paket}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Total Biaya:</span>
                        <span class="detail-value">${this.formatRupiah(doData.total)}</span>
                    </div>
                `;

                // Logika tampilan timeline pada tracking.html
                let timelineHTML = `<div class="tracking-timeline"><h3>Riwayat Perjalanan</h3>`;
                const sortedPerjalanan = [...doData.perjalanan].reverse();
                sortedPerjalanan.forEach(item => {
                    timelineHTML += `
                        <div class="timeline-item">
                            <span class="timeline-time">${item.waktu}</span>
                            <span>${item.keterangan}</span>
                        </div>
                    `;
                });
                timelineHTML += '</div>';

                resultContainer.innerHTML = detailHTML + timelineHTML;

            } else {
                resultContainer.innerHTML = `<p class="not-found">Nomor DO <strong>${doNumber}</strong> tidak ditemukan dalam sistem.</p>`;
            }
        }
    },

    // Watcher stok.html
    watch: {
        // Watcher untuk mereset filter kategori jika UT-Daerah diubah
        'filters.upbjj'(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.filters.kategori = '';
            }
        }
    },

    // Lifecycle Hook
    mounted() {
        console.log("Instance Vue 2 berhasil di-mount. Memuat data mock.");

        this.dashboardCards.find(c => c.id === 1).value = mockApiData.totalPengguna;
        this.dashboardCards.find(c => c.id === 2).value = this.stok.length; 
        this.dashboardCards.find(c => c.id === 3).value = Object.keys(this.tracking).length;

        document.addEventListener('DOMContentLoaded', () => {
            const doInput = document.getElementById('do-number-input');
            if (doInput && doInput.value === "DO2025-0001") {
                this.searchDO(doInput.value.trim().toUpperCase(), 'result-container');
            }
        });
    }
});