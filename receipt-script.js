// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadBusinessDetails();
    setTodayDate();
    generateReceiptNumber();
});

// Tab switching
function switchTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tab + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Logo handling
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoData = e.target.result;
            localStorage.setItem('businessLogo', logoData);
            displayLogo(logoData);
        };
        reader.readAsDataURL(file);
    }
}

function displayLogo(logoData) {
    const previewImg = document.getElementById('preview-img');
    const removeBtn = document.getElementById('remove-logo');

    previewImg.src = logoData;
    previewImg.style.display = 'block';
    removeBtn.style.display = 'inline-block';
}

function removeLogo() {
    localStorage.removeItem('businessLogo');
    document.getElementById('preview-img').style.display = 'none';
    document.getElementById('remove-logo').style.display = 'none';
    document.getElementById('logo-upload').value = '';
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

    localStorage.setItem('businessDetails', JSON.stringify(businessData));

    // Show success message
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

    // Get business details
    const saved = localStorage.getItem('businessDetails');
    if (!saved) {
        showNotification('⚠️ אנא שמור תחילה את פרטי העסק בלשונית "פרטי עסק"', 'error');
        return;
    }

    const businessData = JSON.parse(saved);
    const logoData = localStorage.getItem('businessLogo');

    // Format date
    const formattedDate = new Date(receiptDate).toLocaleDateString('he-IL');

    // Format amount
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Create receipt HTML
    const receiptHTML = `
        <div class="receipt-header">
            ${logoData ? `<img src="${logoData}" class="receipt-logo" alt="לוגו העסק">` : ''}
            <h2>${businessData.name}</h2>
            <div class="business-info">
                <p><strong>עוסק פטור</strong></p>
                <p>ת.ז. / ח.פ.: ${businessData.id}</p>
                <p>${businessData.address}</p>
                <p>טלפון: ${businessData.phone}</p>
                ${businessData.email ? `<p>אימייל: ${businessData.email}</p>` : ''}
            </div>
        </div>

        <div class="receipt-title">קבלה</div>

        <div class="receipt-info">
            <div class="info-item">
                <span class="info-label">מספר קבלה:</span>
                <span class="info-value">${receiptNumber}</span>
            </div>
            <div class="info-item">
                <span class="info-label">תאריך:</span>
                <span class="info-value">${formattedDate}</span>
            </div>
            <div class="info-item">
                <span class="info-label">שם הלקוח:</span>
                <span class="info-value">${customerName}</span>
            </div>
            <div class="info-item">
                <span class="info-label">אמצעי תשלום:</span>
                <span class="info-value">${paymentMethod}</span>
            </div>
        </div>

        <div class="receipt-details">
            <h3>פירוט השירות/מוצר:</h3>
            <table class="receipt-table">
                <thead>
                    <tr>
                        <th>תיאור</th>
                        <th>סכום</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${description}</td>
                        <td>₪${formattedAmount}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="receipt-total">
            סה"כ לתשלום: ₪${formattedAmount}
        </div>

        <div class="receipt-footer">
            <p class="tax-exempt">⚠️ עוסק פטור - חשבונית זו אינה כוללת מע"מ</p>
            <p>תודה שבחרת בשירותינו!</p>

            <div class="signature-line">
                <p>חתימה</p>
            </div>
        </div>
    `;

    // Display receipt
    document.getElementById('receipt-content').innerHTML = receiptHTML;
    document.getElementById('receipt-preview').style.display = 'block';

    // Save receipt number
    localStorage.setItem('lastReceiptNumber', receiptNumber);

    // Scroll to receipt
    document.getElementById('receipt-preview').scrollIntoView({ behavior: 'smooth' });
}

// Print receipt
function printReceipt() {
    window.print();
}

// Close preview
function closePreview() {
    document.getElementById('receipt-preview').style.display = 'none';
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

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
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