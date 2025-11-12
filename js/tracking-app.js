       // Data dari dataBahanAjar.js
        const appData = {
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
            }
        };

        const resultContainer = document.getElementById('result-container');
        const doInput = document.getElementById('do-number-input');

        // Fungsi untuk format mata uang IDR
        function formatRupiah(number) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(number);
        }

        // Fungsi utama untuk mencari dan menampilkan data
        function searchDO() {
            const doNumber = doInput.value.trim().toUpperCase();
            const doData = appData.tracking[doNumber];

            // Bersihkan kontainer hasil
            resultContainer.innerHTML = '';

            if (!doNumber) {
                resultContainer.innerHTML = '<p class="not-found">Mohon masukkan Nomor Delivery Order.</p>';
                return;
            }

            if (doData) {
                // Tampilkan Detail DO
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
                        <span class="detail-value">${formatRupiah(doData.total)}</span>
                    </div>
                `;

                // Tampilkan Timeline Perjalanan
                let timelineHTML = `
                    <div class="tracking-timeline">
                        <h3>Riwayat Perjalanan</h3>
                `;
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
                // Tampilkan pesan jika DO tidak ditemukan
                resultContainer.innerHTML = `<p class="not-found">Nomor DO <strong>${doNumber}</strong> tidak ditemukan dalam sistem.</p>`;
            }
        }

        // Jalankan pencarian otomatis untuk DO2025-0001
        document.addEventListener('DOMContentLoaded', () => {
            if (doInput.value === "DO2025-0001") {
                searchDO();
            }
        });