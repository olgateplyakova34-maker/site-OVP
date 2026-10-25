// ====== МОДАЛЬНЫЕ ОКНА АВТОРИЗАЦИИ ======

function createAuthModals() {
    const modalHTML = `
        <div id="loginModal" class="modal">
            <div class="modal-content">
                <span class="close-modal" onclick="closeModal('loginModal')">&times;</span>
                <h3>Вход в личный кабинет</h3>
                <form id="loginForm">
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="password" name="password" placeholder="Пароль" required>
                    <div id="loginErrors" style="color: #ef4444; margin-bottom: 15px;"></div>
                    <button type="submit" class="btn">Войти</button>
                </form>
                <p style="margin-top: 20px; text-align: center;">
                    Нет аккаунта? <a href="#" onclick="switchToRegister()" style="color: #f59e0b;">Зарегистрироваться</a>
                </p>
            </div>
        </div>
        <div id="registerModal" class="modal">
            <div class="modal-content">
                <span class="close-modal" onclick="closeModal('registerModal')">&times;</span>
                <h3>Регистрация</h3>
                <form id="registerForm">
                    <input type="text" name="name" placeholder="Ваше имя" required>
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="tel" name="phone" placeholder="Телефон" required>
                    <input type="password" name="password" placeholder="Пароль (мин. 6 символов)" required>
                    <input type="password" name="confirm_password" placeholder="Подтвердите пароль" required>
                    <div style="display: flex; align-items: flex-start; gap: 10px; margin: 15px 0;">
                        <input type="checkbox" id="registerPrivacy" name="privacy" required>
                        <label for="registerPrivacy" style="font-size: 0.9rem;">
                            Согласен с <a href="privacy.html" target="_blank" style="color: #f59e0b;">политикой конфиденциальности</a>
                        </label>
                    </div>
                    <div id="registerErrors" style="color: #ef4444; margin-bottom: 15px;"></div>
                    <button type="submit" class="btn">Зарегистрироваться</button>
                </form>
                <p style="margin-top: 20px; text-align: center;">
                    Уже есть аккаунт? <a href="#" onclick="switchToLogin()" style="color: #f59e0b;">Войти</a>
                </p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const navUl = document.querySelector('nav ul');
    if (navUl) {
        const loginLi = document.createElement('li');
        loginLi.innerHTML = '<a href="#" id="loginBtn">Войти</a>';
        navUl.appendChild(loginLi);
        document.getElementById('loginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            openModal('loginModal');
        });
    }
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchToRegister() {
    closeModal('loginModal');
    openModal('registerModal');
}

function switchToLogin() {
    closeModal('registerModal');
    openModal('loginModal');
}

// Обработка форм
document.addEventListener('submit', async (e) => {
    if (e.target.id === 'loginForm') {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const response = await fetch('login.php', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                document.getElementById('loginErrors').innerHTML = data.errors.join('<br>');
            }
        } catch (error) {
            document.getElementById('loginErrors').textContent = 'Ошибка соединения';
        }
    }
    
    if (e.target.id === 'registerForm') {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const response = await fetch('register.php', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                document.getElementById('registerErrors').innerHTML = data.errors.join('<br>');
            }
        } catch (error) {
            document.getElementById('registerErrors').textContent = 'Ошибка соединения';
        }
    }
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Проверка авторизации при загрузке
async function checkAuth() {
    try {
        const response = await fetch('check_auth.php');
        const data = await response.json();
        if (data.logged_in) {
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.textContent = data.user_name;
                loginBtn.href = 'dashboard.php';
            }
        }
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    createAuthModals();
    checkAuth();
});
// ====== AJAX-ОТПРАВКА ФОРМ ЗАЯВОК ======
function handleFormSubmit(form, successRedirect) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                window.location.href = data.redirect || successRedirect;
            } else {
                alert('Ошибка: ' + (data.errors ? data.errors.join('\n') : 'Неизвестная ошибка'));
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            alert('Ошибка соединения с сервером');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Применяем ко всем формам заявок на странице
document.addEventListener('DOMContentLoaded', () => {
    const contactForms = document.querySelectorAll('form[action="submit_form.php"]');
    contactForms.forEach(form => {
        handleFormSubmit(form, 'thankyou.html');
    });
});