// ====== СЛАЙДЕР УСЛУГ ======
const servicesSliderData = [
    {
        img: "images/sliding-gates.jpg",
        title: "Откатные ворота",
        description: "Экономия пространства, плавный ход, надёжность. Устанавливаем на любые проёмы с автоматикой или без."
    },
    {
        img: "images/swing-gates.jpg",
        title: "Распашные ворота",
        description: "Классическое решение для частных домов. Изготавливаем из металла, дерева, с элементами ковки."
    },
    {
        img: "images/sectional-gates.jpg",
        title: "Секционные ворота",
        description: "Идеальны для гаражей. Теплоизоляция, компактность, широкий выбор дизайна и цветов."
    },
    {
        img: "images/automatic-gates.jpg",
        title: "Автоматизация ворот",
        description: "Установка электроприводов, пультов, фотоэлементов. Делаем ворота «умными» и безопасными."
    },
    {
        img: "images/wicket.jpg",
        title: "Калитки",
        description: "Монтаж калиток из металла, дерева, с коваными элементами. Подбираем дизайн под стиль забора."
    },
    {
        img: "images/roller-shutters.jpg",
        title: "Рольставни (ролеты)",
        description: "Защитные рольставни для окон, дверей, гаражей. Высокая взломостойкость, тепло- и шумоизоляция."
    },
    {
        img: "images/barrier.jpg",
        title: "Шлагбаумы",
        description: "Автоматические шлагбаумы. Надёжные приводы и дистанционное управление."
    },
    {
        img: "images/rolling-gates.jpg",
        title: "Рулонные ворота",
        description: "Компактные рулонные ворота для гаражей и ангаров. Экономия пространства, быстрый монтаж, долговечность."
    }
];

const sliderWrapper = document.getElementById('servicesSliderWrapper');
const sliderWrapper = document.getElementById('portfolioSlider');
const dotsContainer = document.getElementById('servicesDots');
let currentIndex = 0;

function renderServicesSlider() {
    if (!sliderWrapper) return;

    sliderWrapper.innerHTML = servicesSliderData.map(slide => `
        <div class="services-slide">
            <img src="${slide.img}" alt="${slide.title}" class="lightbox-trigger" data-full="${slide.img}">
            <div class="services-slide-caption">
                <h4>${slide.title}</h4>
                <p>${slide.description}</p>
            </div>
        </div>
    `).join('');

    dotsContainer.innerHTML = servicesSliderData.map((_, i) => 
        `<span class="services-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');

    updateSliderPosition();

    // Фиксируем высоту слайдов принудительно
    document.querySelectorAll('.services-slide').forEach(slide => {
        slide.style.height = '650px';
        slide.style.overflow = 'hidden';
    });
}

function updateSliderPosition() {
    sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll('.services-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

document.getElementById('prevServiceSlide')?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + servicesSliderData.length) % servicesSliderData.length;
    updateSliderPosition();
});

document.getElementById('nextServiceSlide')?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % servicesSliderData.length;
    updateSliderPosition();
});

dotsContainer?.addEventListener('click', e => {
    const dot = e.target.closest('.services-dot');
    if (dot) {
        currentIndex = parseInt(dot.dataset.index);
        updateSliderPosition();
    }
});

if (sliderWrapper) renderServicesSlider();

// ====== ЛАЙТБОКС С ЗУМОМ И ПЕРЕЛИСТЫВАНИЕМ ======
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.querySelector('.lightbox .close');
const prevBtn = document.getElementById('lightboxPrev');
const nextBtn = document.getElementById('lightboxNext');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomResetBtn = document.getElementById('zoomReset');

let currentScale = 1;
let translateX = 0, translateY = 0;
let isDragging = false;
let startX, startY;
const scaleStep = 0.2;
const maxScale = 3;
const minScale = 0.5;

let currentGallery = [];
let currentImageIndex = 0;

function applyTransform() {
    lightboxImg.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
}

function resetZoom() {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
    lightboxImg.style.cursor = 'grab';
}

function updateLightboxImage() {
    if (currentGallery.length && currentImageIndex >= 0 && currentImageIndex < currentGallery.length) {
        const imgElement = currentGallery[currentImageIndex];
        const src = imgElement.dataset.full || imgElement.src;
        lightboxImg.src = src;
        resetZoom();
    }
}

function openLightbox(clickedImg) {
    const galleryContainer = clickedImg.closest('.gallery-grid, .slider-wrapper, .services-slider-wrapper, .gallery-section, .services-slider-container');
    if (galleryContainer) {
        currentGallery = Array.from(galleryContainer.querySelectorAll('.lightbox-trigger'));
    } else {
        currentGallery = Array.from(document.querySelectorAll('.lightbox-trigger'));
    }
    currentImageIndex = currentGallery.indexOf(clickedImg);
    updateLightboxImage();
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    lightbox.style.display = 'none';
    resetZoom();
}

function nextImage() {
    if (currentGallery.length) {
        currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
        updateLightboxImage();
    }
}

function prevImage() {
    if (currentGallery.length) {
        currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightboxImage();
    }
}

// Открытие по клику
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox-trigger')) {
        e.preventDefault();
        openLightbox(e.target);
    }
});

// Закрытие
closeBtn?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Кнопки навигации
prevBtn?.addEventListener('click', prevImage);
nextBtn?.addEventListener('click', nextImage);

// Клавиатура
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') prevImage();
    else if (e.key === 'ArrowRight') nextImage();
});

// Зум кнопки
zoomInBtn?.addEventListener('click', () => {
    if (currentScale < maxScale) {
        currentScale += scaleStep;
        applyTransform();
    }
});
zoomOutBtn?.addEventListener('click', () => {
    if (currentScale > minScale) {
        currentScale -= scaleStep;
        applyTransform();
    }
});
zoomResetBtn?.addEventListener('click', resetZoom);

// Зум колёсиком
lightboxImg?.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -scaleStep : scaleStep;
    let newScale = currentScale + delta;
    if (newScale >= minScale && newScale <= maxScale) {
        currentScale = newScale;
        applyTransform();
    }
});

// Перетаскивание
lightboxImg?.addEventListener('mousedown', (e) => {
    if (currentScale > 1) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        lightboxImg.style.cursor = 'grabbing';
        e.preventDefault();
    }
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    applyTransform();
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    lightboxImg.style.cursor = currentScale > 1 ? 'grab' : 'default';
});
const modal = document.getElementById('modalForm');
const showBtn = document.getElementById('showModalBtn');
const closeModal = document.querySelector('.close-modal');

if(showBtn) {
    showBtn.addEventListener('click', () => modal.style.display = 'flex');
}
closeModal?.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
// ====== МАСКА ДЛЯ ТЕЛЕФОНА ======
function applyPhoneMask(input) {
    input.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, ''); // оставляем только цифры
        let formatted = '+7 (';
        
        if (value.length > 1) {
            formatted += value.substring(1, 4);
        }
        if (value.length >= 4) {
            formatted += ') ' + value.substring(4, 7);
        }
        if (value.length >= 7) {
            formatted += '-' + value.substring(7, 9);
        }
        if (value.length >= 9) {
            formatted += '-' + value.substring(9, 11);
        }
        
        this.value = formatted;
        
        // Если стёрли всё, оставляем пустым или шаблон
        if (value.length === 0) {
            this.value = '';
        }
    });
    
    // При потере фокуса, если номер не полный, можно оставить как есть или очистить
    input.addEventListener('blur', function() {
        if (this.value.replace(/\D/g, '').length < 11) {
            // Можно подсветить ошибку, но не обязательно
        }
    });
}

// Применяем маску ко всем телефонным полям на странице
document.querySelectorAll('input[type="tel"]').forEach(applyPhoneMask);

// ====== ВАЛИДАЦИЯ EMAIL (ДОПОЛНЕНИЕ) ======
function validateEmailInput(emailField) {
    emailField.addEventListener('input', function(e) {
        const email = this.value;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        // Проверяем при вводе (не блокируем ввод, только визуальное предупреждение)
        if (email.length > 0 && email.includes('@')) {
            const domainPart = email.split('@')[1];
            
            // Проверяем, есть ли точка в доменной части
            if (domainPart && !domainPart.includes('.')) {
                this.style.borderColor = '#f59e0b'; // оранжевый - предупреждение
                this.style.backgroundColor = '#fffbeb';
                this.setCustomValidity('Введите полный домен (например: mail.ru)');
            } 
            // Проверяем, не заканчивается ли на точку или дефис
            else if (domainPart && (domainPart.endsWith('.') || domainPart.endsWith('-'))) {
                this.style.borderColor = '#f59e0b';
                this.style.backgroundColor = '#fffbeb';
                this.setCustomValidity('Домен не может заканчиваться на точку или дефис');
            }
            // Проверяем полное соответствие формату
            else if (!emailRegex.test(email) && email.length > 0) {
                this.style.borderColor = '#ef4444'; // красный - ошибка
                this.style.backgroundColor = '#fef2f2';
                
                // Определяем конкретную ошибку
                if (!email.includes('@')) {
                    this.setCustomValidity('Email должен содержать символ @');
                } else if (domainPart && domainPart.length < 3) {
                    this.setCustomValidity('Укажите корректный домен');
                } else {
                    this.setCustomValidity('Введите корректный email (например: name@mail.ru)');
                }
            } else {
                this.style.borderColor = '#10b981'; // зелёный - валидно
                this.style.backgroundColor = '#f0fdf4';
                this.setCustomValidity('');
            }
        } else {
            this.style.borderColor = '#e2e8f0';
            this.style.backgroundColor = 'white';
            this.setCustomValidity('');
        }
    });
    
    // Дополнительная проверка при потере фокуса
    emailField.addEventListener('blur', function() {
        const email = this.value;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (email.length > 0 && !emailRegex.test(email)) {
            this.style.borderColor = '#ef4444';
            this.style.backgroundColor = '#fef2f2';
            
            if (!email.includes('@')) {
                this.setCustomValidity('Email должен содержать символ @');
            } else {
                const domainPart = email.split('@')[1];
                if (!domainPart || !domainPart.includes('.')) {
                    this.setCustomValidity('Укажите корректный домен (например: mail.ru, gmail.com)');
                } else {
                    this.setCustomValidity('Введите корректный email');
                }
            }
            
            // Показываем подсказку пользователю
            this.reportValidity();
        } else if (email.length > 0) {
            this.style.borderColor = '#10b981';
            this.style.backgroundColor = '#f0fdf4';
            this.setCustomValidity('');
        } else {
            this.style.borderColor = '#e2e8f0';
            this.style.backgroundColor = 'white';
            this.setCustomValidity('');
        }
    });
}

// Применяем валидацию ко всем email полям
document.querySelectorAll('input[type="email"]').forEach(validateEmailInput);

// Также добавляем обработчик для динамически создаваемых email полей
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
                const emailInputs = node.querySelectorAll ? node.querySelectorAll('input[type="email"]') : [];
                emailInputs.forEach(validateEmailInput);
                
                if (node.matches && node.matches('input[type="email"]')) {
                    validateEmailInput(node);
                }
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Дополнительно: предотвращаем отправку формы с невалидным email
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput) {
            const email = emailInput.value;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            if (!emailRegex.test(email)) {
                e.preventDefault();
                emailInput.style.borderColor = '#ef4444';
                emailInput.style.backgroundColor = '#fef2f2';
                
                if (!email.includes('@')) {
                    emailInput.setCustomValidity('Email должен содержать символ @');
                } else {
                    const domainPart = email.split('@')[1];
                    if (!domainPart || !domainPart.includes('.')) {
                        emailInput.setCustomValidity('Укажите корректный домен (например: mail.ru, gmail.com)');
                    } else {
                        emailInput.setCustomValidity('Введите корректный email');
                    }
                }
                
                emailInput.reportValidity();
                return false;
            }
        }
    });
});
// ===== ПОИСК + ВЫПАДАЮЩИЙ ФИЛЬТР =====
// вставить в самый низ JS файла

window.addEventListener('load', function () {

    const searchInput = document.getElementById('priceSearch');
    const clearBtn = document.getElementById('clearSearch');
    const filterSelect = document.getElementById('priceFilter');
    const noResults = document.getElementById('noResultsMessage');

    if (!searchInput) return;

    function normalize(text){
        return text.toLowerCase().replace(/ё/g,'е').trim();
    }

    function filterTables(){

        const blocks = document.querySelectorAll('.pricing-wrapper');

        const search = normalize(searchInput.value);
        const filter = normalize(filterSelect.value);

        let found = 0;

        blocks.forEach(block => {

            const title = normalize(
                block.querySelector('th')?.textContent || ''
            );

            let searchMatch = true;
            let selectMatch = true;

            // поиск
            if(search !== ''){
                const words = search.split(/\s+/).filter(Boolean);
                searchMatch = words.every(word => title.includes(word));
            }

            // dropdown фильтр
            if(filter !== ''){
                selectMatch = title.includes(filter);
            }

            if(searchMatch && selectMatch){
                block.style.display = '';
                found++;
            }else{
                block.style.display = 'none';
            }

        });

        noResults.style.display = found === 0 ? 'block' : 'none';
    }

    searchInput.addEventListener('input', filterTables);
    filterSelect.addEventListener('change', filterTables);

    clearBtn.addEventListener('click', function(){
        searchInput.value = '';
        filterTables();
        searchInput.focus();
    });

    filterTables();

});
