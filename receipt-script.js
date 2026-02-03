// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadBusinessDetails();
    setTodayDate();
    generateReceiptNumber();
    initSmoothScroll();
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize smooth scroll for nav links
function initSmoothScroll() {
    // Prevent default anchor behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
}

// Logo handling with improved UX
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('⚠️ הקובץ גדול מדי. גודל מקסימלי: 5MB', 'error');
            return;
        }

        // Validate file type
        if (!file.type.match('image.*')) {
            showNotification('⚠️ יש להעלות קובץ תמונה בלבד', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const logoData = e.target.result;
            localStorage.setItem('businessLogo', logoData);
            displayLogo(logoData);
            showNotification('✅ הלוגו הועלה בהצלחה!');
        };
        reader.readAsDataURL(file);
    }
}

function displayLogo(logoData) {
    const previewImg = document.getElementById('preview-img');
    const removeBtn = document.getElementById('remove-logo');
    const placeholder = document.getElementById('upload-placeholder');

    if (placeholder) {
        placeholder.style.display = 'none';
    }

    previewImg.src = logoData;
    previewImg.style.display = 'block';
    removeBtn.style.display = 'inline-block';
}

function removeLogo() {
    localStorage.removeItem('businessLogo');
    const previewImg = document.getElementById('preview-img');
    const removeBtn = document.getElementById('remove-logo');
    const placeholder = document.getElementById('upload-placeholder');

    previewImg.style.display = 'none';
    removeBtn.style.display = 'none';

    if (placeholder) {
        placeholder.style.display = 'flex';
    }

    document.getElementById('logo-upload').value = '';
    showNotification('🗑️ הלוגו הוסר');
}

// Save business details to localStorage
function saveBusinessDetails() {
    const businessData = {
        name: document.getElementById('business-name').value,
        owner: document.getElementById('owner-name').value,
        id: document.getElementById('business-id').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
    };

    // Validate required fields
    if (!businessData.name || !businessData.id || !businessData.phone) {
        showNotification('⚠️ אנא מלא לפחות: שם עסק, ת.ז./ח.פ. וטלפון', 'error');
        return;
    }

    localStorage.setItem('businessDetails', JSON.stringify(businessData));
    showNotification('✅ פרטי העסק נשמרו בהצלחה!');
}

// Load business details from localStorage
function loadBusinessDetails() {
    const saved = localStorage.getItem('businessDetails');
    if (saved) {
        const businessData = JSON.parse(saved);
        document.getElementById('business-name').value = businessData.name || '';
        document.getElementById('owner-name').value = businessData.owner || '';
        document.getElementById('business-id').value = businessData.id || '';
        document.getElementById('address').value = businessData.address || '';
        document.getElementById('phone').value = businessData.phone || '';
        document.getElementById('email').value = businessData.email || '';
    }

    // Load logo
    const savedLogo = localStorage.getItem('businessLogo');
    if (savedLogo) {
        displayLogo(savedLogo);
    }
}

// Set today's date
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('receipt-date').value = today;
}

// Generate receipt number
function generateReceiptNumber() {
    let lastNumber = localStorage.getItem('lastReceiptNumber') || 0;
    lastNumber = parseInt(lastNumber) + 1;
    document.getElementById('receipt-number').value = String(lastNumber).padStart(4, '0');
}

// Generate receipt
function generateReceipt() {
    // Validate required fields
    const receiptNumber = document.getElementById('receipt-number').value;
    const receiptDate = document.getElementById('receipt-date').value;
    const customerName = document.getElementById('customer-name').value;
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if (!receiptNumber || !receiptDate || !customerName || !description || !amount) {
        showNotification('⚠️ אנא מלא את כל השדות הנדרשים', 'error');
        return;
    }

    // Validate amount
    if (parseFloat(amount) <= 0) {
        showNotification('⚠️ הסכום חייב להיות גדול מ-0', 'error');
        return;
    }

    // Get business details
    const saved = localStorage.getItem('businessDetails');
    if (!saved) {
        showNotification('⚠️ אנא שמור תחילה את פרטי העסק', 'error');
        scrollToSection('business');
        return;
    }

    const businessData = JSON.parse(saved);
    const logoData = localStorage.getItem('businessLogo');

    // Format date
    const formattedDate = new Date(receiptDate).toLocaleDateString('he-IL');

    // Format amount
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Create receipt HTML - New format matching the example
    const receiptHTML = `
        <div class="receipt-header-new">
            <div class="header-right">
                ${logoData ? `<img src="${logoData}" class="receipt-logo-new" alt="לוגו העסק">` : '<div class="logo-placeholder"></div>'}
            </div>
            <div class="header-left">
                <h1 class="business-name-new">${businessData.name}</h1>
                <div class="business-details-new">
                    <p>עוסק פטור: ${businessData.id}</p>
                    <p>טלפון: ${businessData.phone}</p>
                    <p>דוא"ל: ${businessData.email || 'לא צוין'}</p>
                </div>
            </div>
        </div>

        <div class="receipt-date-section">
            <div class="date-box">
                <strong>${formattedDate}</strong>
                <div class="receipt-number-label">קבלה מספר: ${receiptNumber}</div>
            </div>
        </div>

        <div class="customer-section">
            <h3>לכבוד:</h3>
            <div class="customer-info-new">
                <p><strong>${customerName}</strong></p>
                <p>טלפון: ${document.getElementById('phone').value || 'לא צוין'}</p>
            </div>
        </div>

        <div class="service-description-new">
            <p>${description}</p>
        </div>

        <table class="receipt-table-new">
            <thead>
                <tr>
                    <th>סכום</th>
                    <th>טיפול נוספים</th>
                    <th>מחיר השרות</th>
                    <th>תיאור:</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>₪${formattedAmount}</strong></td>
                    <td>כבוד 6 חודשים</td>
                    <td>-</td>
                    <td>${description.substring(0, 30)}${description.length > 30 ? '...' : ''}</td>
                </tr>
            </tbody>
        </table>

        <div class="total-section-new">
            <div class="total-row">
                <span class="total-label">סה"כ לתשלום:</span>
                <span class="total-amount">₪${formattedAmount}</span>
            </div>
        </div>

        <div class="payment-method-new">
            <p><strong>שולם במזומן/העברה</strong></p>
        </div>

        <div class="footer-new">
            <p class="tax-exempt-new">⚠️ עוסק פטור</p>
        </div>
    `;

    // Display receipt
    document.getElementById('receipt-content').innerHTML = receiptHTML;
    document.getElementById('receipt-preview').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Save receipt number
    localStorage.setItem('lastReceiptNumber', receiptNumber);

    showNotification('✅ הקבלה נוצרה בהצלחה!');
}

// Download receipt as PDF
function downloadPDF() {
    // Get the receipt element
    const receiptElement = document.querySelector('#receipt-content .receipt');

    if (!receiptElement) {
        showNotification('⚠️ לא נמצאה קבלה להורדה', 'error');
        return;
    }

    // Get receipt number for filename
    const receiptNumber = document.getElementById('receipt-number').value || '0001';
    const customerName = document.getElementById('customer-name').value || 'customer';
    const sanitizedCustomerName = customerName.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_');
    const filename = `receipt-${receiptNumber}-${sanitizedCustomerName}.pdf`;

    // Show loading notification
    showNotification('⏳ מכין את ה-PDF...', 'info');

    // Clone the element to avoid modifying the original
    const clonedElement = receiptElement.cloneNode(true);

    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
    tempContainer.style.background = 'white';
    tempContainer.style.padding = '20px';
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // PDF options
    const opt = {
        margin: 10,
        filename: filename,
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 794,
            width: 794
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    // Generate PDF
    html2pdf()
        .set(opt)
        .from(tempContainer)
        .save()
        .then(() => {
            // Remove temporary container
            document.body.removeChild(tempContainer);
            showNotification('✅ ה-PDF הורד בהצלחה!', 'success');
        })
        .catch((error) => {
            // Remove temporary container on error
            if (document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
            }
            console.error('PDF Error:', error);
            showNotification('⚠️ שגיאה ביצירת PDF. נסה שוב.', 'error');
        });
}

// Print receipt
function printReceipt() {
    window.print();
}

// Close preview
function closePreview() {
    document.getElementById('receipt-preview').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scroll
    generateReceiptNumber(); // Generate new number for next receipt
}

// Clear receipt form
function clearReceiptForm() {
    document.getElementById('customer-name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('payment-method').value = 'מזומן';
    setTodayDate();
    generateReceiptNumber();

    showNotification('🗑️ הטופס נוקה בהצלחה');
}

// Show notification with modern style
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Determine colors based on type
    let bgColor, textColor;
    if (type === 'error') {
        bgColor = '#ff4444';
        textColor = '#ffffff';
    } else if (type === 'info') {
        bgColor = '#ffffff';
        textColor = '#000000';
    } else {
        bgColor = '#00ff88';
        textColor = '#000000';
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${bgColor};
        color: ${textColor};
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        animation: slideInNotif 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
    `;
    notification.textContent = message;

    // Add animation
    if (!document.getElementById('notif-animation')) {
        const style = document.createElement('style');
        style.id = 'notif-animation';
        style.textContent = `
            @keyframes slideInNotif {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutNotif {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutNotif 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Auto-save business details on input
['business-name', 'owner-name', 'business-id', 'address', 'phone', 'email'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('change', saveBusinessDetails);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P to print when receipt is open
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        const receiptPreview = document.getElementById('receipt-preview');
        if (receiptPreview && receiptPreview.style.display === 'flex') {
            e.preventDefault();
            printReceipt();
        }
    }

    // ESC to close receipt preview
    if (e.key === 'Escape') {
        const receiptPreview = document.getElementById('receipt-preview');
        if (receiptPreview && receiptPreview.style.display === 'flex') {
            closePreview();
        }
    }
});