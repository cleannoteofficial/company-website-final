// Price Calculator for Clean Note Quote Page

let selectedService = null;
let selectedArea = null;
let basePrice = 0;
let areaMultiplier = 1.0;
let additionalServices = [];
let urgentFee = 0;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("cyDCmmrsw5CBTSeJ_");
    
    initializeServiceSelection();
    initializeAreaSelection();
    initializeAdditionalServices();
    initializeUrgentOption();
    initializeSubmitButton();
});

// Service Selection
function initializeServiceSelection() {
    const serviceOptions = document.querySelectorAll('.service-option');
    
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            serviceOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get service data
            selectedService = this.dataset.service;
            basePrice = parseInt(this.dataset.basePrice);
            
            // Update price calculation
            calculateTotalPrice();
        });
    });
}

// Area Selection
function initializeAreaSelection() {
    const areaButtons = document.querySelectorAll('.area-btn');
    
    areaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            areaButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get area data
            selectedArea = this.dataset.area;
            areaMultiplier = parseFloat(this.dataset.multiplier);
            
            // Update price calculation
            calculateTotalPrice();
        });
    });
}

// Additional Services
function initializeAdditionalServices() {
    const checkboxOptions = document.querySelectorAll('.checkbox-option[data-price]');
    
    checkboxOptions.forEach(option => {
        const checkbox = option.querySelector('input[type="checkbox"]');
        
        checkbox.addEventListener('change', function() {
            updateAdditionalServices();
        });
    });
}

function updateAdditionalServices() {
    additionalServices = [];
    
    const checkboxOptions = document.querySelectorAll('.checkbox-option[data-price]');
    checkboxOptions.forEach(option => {
        const checkbox = option.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            const price = parseInt(option.dataset.price);
            const label = option.querySelector('.checkbox-label').textContent.split('+')[0].trim();
            additionalServices.push({
                name: label,
                price: price
            });
        }
    });
    
    calculateTotalPrice();
}

// Urgent Option
function initializeUrgentOption() {
    const urgentCheckbox = document.getElementById('urgent');
    const configUrgentFee = (typeof CONFIG !== 'undefined' && CONFIG.urgentFee) ? CONFIG.urgentFee : 20000;
    
    urgentCheckbox.addEventListener('change', function() {
        urgentFee = this.checked ? configUrgentFee : 0;
        calculateTotalPrice();
    });
}

// Calculate Total Price
function calculateTotalPrice() {
    const priceBreakdown = document.getElementById('priceBreakdown');
    const totalPriceElement = document.querySelector('.total-amount');
    
    // Check if service and area are selected
    if (!selectedService || !selectedArea) {
        priceBreakdown.innerHTML = '<p class="no-selection">서비스와 면적을 선택해주세요</p>';
        totalPriceElement.textContent = '0원';
        return;
    }
    
    // Calculate base price with area multiplier
    const calculatedBasePrice = Math.round(basePrice * areaMultiplier);
    
    // Build breakdown HTML
    let breakdownHTML = '';
    
    // Base service
    const serviceName = getServiceName(selectedService);
    breakdownHTML += `
        <div class="breakdown-item">
            <span class="breakdown-label">${serviceName} (${selectedArea}평)</span>
            <span class="breakdown-price">${formatPrice(calculatedBasePrice)}</span>
        </div>
    `;
    
    // Additional services
    let additionalTotal = 0;
    additionalServices.forEach(service => {
        additionalTotal += service.price;
        breakdownHTML += `
            <div class="breakdown-item">
                <span class="breakdown-label">${service.name}</span>
                <span class="breakdown-price">+${formatPrice(service.price)}</span>
            </div>
        `;
    });
    
    // Urgent fee
    if (urgentFee > 0) {
        breakdownHTML += `
            <div class="breakdown-item">
                <span class="breakdown-label">긴급 청소 (당일·익일)</span>
                <span class="breakdown-price">+${formatPrice(urgentFee)}</span>
            </div>
        `;
    }
    
    priceBreakdown.innerHTML = breakdownHTML;
    
    // Calculate total
    const totalPrice = calculatedBasePrice + additionalTotal + urgentFee;
    totalPriceElement.textContent = formatPrice(totalPrice);
    
    // Add animation
    totalPriceElement.style.animation = 'none';
    setTimeout(() => {
        totalPriceElement.style.animation = 'pulse 0.5s ease';
    }, 10);
}

// Helper function to get service name
function getServiceName(serviceCode) {
    const serviceNames = {
        'ipju': '입주 청소',
        'moving': '이사 청소',
        'residence': '거주 청소',
        'office': '사무실 청소',
        'store': '상가 청소',
        'building': '빌딩 청소'
    };
    return serviceNames[serviceCode] || '청소 서비스';
}

// Helper function to format price
function formatPrice(price) {
    return price.toLocaleString('ko-KR') + '원';
}

// Submit Button
function initializeSubmitButton() {
    const submitBtn = document.getElementById('submitQuote');
    
    submitBtn.addEventListener('click', function() {
        // Get form data
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const message = document.getElementById('message').value;
        const preferredDate = document.getElementById('preferred-date').value;
        
        // Validation
        if (!selectedService || !selectedArea) {
            alert('서비스와 면적을 선택해주세요.');
            return;
        }
        
        if (!name || !phone || !address) {
            alert('필수 정보(이름, 연락처, 주소)를 입력해주세요.');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';
        
        const totalPrice = calculateFinalPrice();
        const serviceName = getServiceName(selectedService);
        
        // Prepare email data
        const urgentCheckbox = document.getElementById('urgent');
        const urgentService = urgentCheckbox && urgentCheckbox.checked ? '예' : '아니오';
        
        const emailData = {
            customer_name: name,
            customer_phone: phone,
            customer_email: email || '없음',
            customer_address: address,
            service_type: serviceName,
            area_size: selectedArea + '평',
            total_price: formatPrice(totalPrice),
            urgent_service: urgentService,
            additional_services: additionalServices.length > 0 ? 
                additionalServices.map(s => s.name).join(', ') : '없음',
            preferred_date: preferredDate || '미정',
            message: message || '없음'
        };
        
        // Send email via EmailJS
        emailjs.send('service_yaji9c7', 'template_9wg41sh', emailData)
            .then(function(response) {
                console.log('이메일 전송 성공:', response);
                alert('견적 신청이 완료되었습니다!\n곧 담당자가 연락드리겠습니다.');
                resetForm();
            })
            .catch(function(error) {
                console.error('이메일 전송 실패:', error);
                alert('전송 중 오류가 발생했습니다.\n다시 시도해주세요.');
            })
            .finally(function() {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = '무료 견적 신청하기 →';
            });
    });
}

// Calculate final price helper
function calculateFinalPrice() {
    if (!selectedService || !selectedArea) return 0;
    
    const calculatedBasePrice = Math.round(basePrice * areaMultiplier);
    const additionalTotal = additionalServices.reduce((sum, service) => sum + service.price, 0);
    return calculatedBasePrice + additionalTotal + urgentFee;
}

// Reset form (optional)
function resetForm() {
    // Reset selections
    document.querySelectorAll('.service-option').forEach(opt => opt.classList.remove('active'));
    document.querySelectorAll('.area-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Reset form fields
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('address').value = '';
    document.getElementById('message').value = '';
    document.getElementById('preferred-date').value = '';
    
    // Reset variables
    selectedService = null;
    selectedArea = null;
    basePrice = 0;
    areaMultiplier = 1.0;
    additionalServices = [];
    urgentFee = 0;
    
    // Update display
    calculateTotalPrice();
}

// Add pulse animation styles
const quoteStyle = document.createElement('style');
quoteStyle.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(quoteStyle);
