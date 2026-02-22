/* ============================================
   PDF Export Module — Export summary via html2pdf.js
   ============================================ */

/**
 * Export the given element to PDF.
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} filename - The output PDF filename
 */
async function exportToPDF(element, filename = 'GPA_Report.pdf') {
    if (typeof html2pdf === 'undefined') {
        showToast('ไม่สามารถโหลด PDF library ได้');
        return;
    }

    try {
        const opt = {
            margin: [10, 10, 10, 10],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#FFFFFF',
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
            },
        };

        await html2pdf().set(opt).from(element).save();

        showToast('📄 ส่งออก PDF สำเร็จ!');
    } catch (err) {
        console.error('PDF export failed:', err);
        showToast('เกิดข้อผิดพลาดในการส่งออก PDF');
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

export { exportToPDF };
