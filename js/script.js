// Основной JavaScript файл для сайта DevPortfolio

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    initTheme();
    
    // Инициализация счетчика посетителей
    initVisitorCounter();
    
    // Инициализация меню на мобильных устройствах
    initMobileMenu();
    
    // Инициализация формы обратной связи
    initContactForm();
    
    // Инициализация лайков в блоге
    initBlogLikes();
    
    // Инициализация поиска в блоге
    initBlogSearch();
    
    // Инициализация всех кнопок переключения темы
    initAllThemeToggles();
    
    // Инициализация сохранения данных формы
    initFormDataSaving();
});

// Функция инициализации темы
function initTheme() {
    // Проверяем сохраненную тему в localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Применяем сохраненную тему
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateThemeIcons('dark');
    } else {
        document.body.classList.remove('dark-theme');
        updateThemeIcons('light');
    }
}

// Функция переключения темы
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    
    // Определяем текущую тему
    const isDarkTheme = body.classList.contains('dark-theme');
    
    // Сохраняем выбор темы в localStorage
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    
    // Обновляем иконки темы
    updateThemeIcons(isDarkTheme ? 'dark' : 'light');
    
    // Показываем уведомление
    showNotification(`Тема изменена на ${isDarkTheme ? 'темную' : 'светлую'}`);
}

// Функция обновления иконок темы
function updateThemeIcons(theme) {
    const themeIcons = document.querySelectorAll('#themeToggle i, #footerThemeToggle i');
    const themeButtons = document.querySelectorAll('#themeToggle, #footerThemeToggle');
    
    themeIcons.forEach(icon => {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            // Обновляем текст кнопки в футере
            if (icon.closest('#footerThemeToggle')) {
                const button = icon.closest('button');
                if (button) {
                    const span = button.querySelector('span');
                    if (span) span.textContent = 'Сменить тему';
                    button.innerHTML = '<i class="fas fa-sun"></i> Светлая тема';
                }
            }
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            // Обновляем текст кнопки в футере
            if (icon.closest('#footerThemeToggle')) {
                const button = icon.closest('button');
                if (button) {
                    const span = button.querySelector('span');
                    if (span) span.textContent = 'Сменить тему';
                    button.innerHTML = '<i class="fas fa-moon"></i> Темная тема';
                }
            }
        }
    });
}

// Функция инициализации всех кнопок переключения темы
function initAllThemeToggles() {
    const themeToggles = document.querySelectorAll('#themeToggle, #footerThemeToggle');
    
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });
}

// Функция инициализации счетчика посетителей
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitorCount');
    
    if (visitorCountElement) {
        // Получаем текущее количество посетителей из localStorage
        let visitorCount = localStorage.getItem('visitorCount') || 0;
        
        // Увеличиваем счетчик
        visitorCount = parseInt(visitorCount) + 1;
        
        // Сохраняем обновленное значение
        localStorage.setItem('visitorCount', visitorCount);
        
        // Обновляем отображение
        visitorCountElement.textContent = visitorCount;
    }
}

// Функция инициализации мобильного меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.innerHTML = navList.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Закрываем меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Функция инициализации формы обратной связи
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Загружаем сохраненные данные формы
        loadFormData();
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Проверяем, нужно ли сохранять данные
            const saveInfo = document.getElementById('saveInfo').checked;
            
            if (saveInfo) {
                // Сохраняем данные формы
                localStorage.setItem('contactFormData', JSON.stringify(formData));
            } else {
                // Удаляем сохраненные данные
                localStorage.removeItem('contactFormData');
            }
            
            // Имитация отправки формы
            const formMessage = document.getElementById('formMessage');
            formMessage.textContent = 'Сообщение отправлено! Мы свяжемся с вами в ближайшее время.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            
            // Очищаем форму
            contactForm.reset();
            
            // Показываем уведомление
            showNotification('Сообщение успешно отправлено!');
            
            // Скрываем сообщение через 5 секунд
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }
}

// Функция загрузки сохраненных данных формы
function loadFormData() {
    const savedFormData = localStorage.getItem('contactFormData');
    
    if (savedFormData) {
        try {
            const formData = JSON.parse(savedFormData);
            
            // Заполняем поля формы
            if (document.getElementById('name')) document.getElementById('name').value = formData.name || '';
            if (document.getElementById('email')) document.getElementById('email').value = formData.email || '';
            if (document.getElementById('subject')) document.getElementById('subject').value = formData.subject || '';
            if (document.getElementById('message')) document.getElementById('message').value = formData.message || '';
            
            // Устанавливаем чекбокс
            if (document.getElementById('saveInfo')) document.getElementById('saveInfo').checked = true;
            
        } catch (e) {
            console.error('Ошибка при загрузке данных формы:', e);
        }
    }
}

// Функция инициализации сохранения данных формы
function initFormDataSaving() {
    const saveInfoCheckbox = document.getElementById('saveInfo');
    
    if (saveInfoCheckbox) {
        saveInfoCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Сохраняем текущие данные формы
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };
                
                localStorage.setItem('contactFormData', JSON.stringify(formData));
                showNotification('Данные сохранены для будущих обращений');
            } else {
                localStorage.removeItem('contactFormData');
                showNotification('Сохранение данных отключено');
            }
        });
    }
}

// Функция инициализации лайков в блоге
function initBlogLikes() {
    const likeButtons = document.querySelectorAll('.btn-like');
    
    likeButtons.forEach(button => {
        // Загружаем сохраненные лайки
        const postId = button.getAttribute('data-post');
        const savedLikes = localStorage.getItem(`likes_${postId}`);
        
        if (savedLikes) {
            const likeCount = button.querySelector('.like-count');
            if (likeCount) {
                likeCount.textContent = savedLikes;
            }
            
            // Проверяем, лайкнул ли пользователь этот пост
            const userLiked = localStorage.getItem(`userLiked_${postId}`);
            if (userLiked === 'true') {
                button.classList.add('liked');
                button.querySelector('i').classList.remove('far');
                button.querySelector('i').classList.add('fas');
            }
        }
        
        // Обработчик клика на лайк
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post');
            const likeCountElement = this.querySelector('.like-count');
            let likeCount = parseInt(likeCountElement.textContent);
            const icon = this.querySelector('i');
            
            // Проверяем, лайкнул ли уже пользователь этот пост
            const userLiked = localStorage.getItem(`userLiked_${postId}`);
            
            if (userLiked === 'true') {
                // Убираем лайк
                likeCount--;
                this.classList.remove('liked');
                icon.classList.remove('fas');
                icon.classList.add('far');
                localStorage.setItem(`userLiked_${postId}`, 'false');
                showNotification('Лайк удален');
            } else {
                // Добавляем лайк
                likeCount++;
                this.classList.add('liked');
                icon.classList.remove('far');
                icon.classList.add('fas');
                localStorage.setItem(`userLiked_${postId}`, 'true');
                showNotification('Посту поставлен лайк!');
            }
            
            // Обновляем счетчик
            likeCountElement.textContent = likeCount;
            
            // Сохраняем общее количество лайков
            localStorage.setItem(`likes_${postId}`, likeCount);
        });
    });
}

// Функция инициализации поиска в блоге
function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchButton) {
        // Обработчик поиска
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm) {
                const blogPosts = document.querySelectorAll('.blog-post');
                let foundPosts = 0;
                
                blogPosts.forEach(post => {
                    const postTitle = post.querySelector('h2').textContent.toLowerCase();
                    const postContent = post.querySelector('.post-content').textContent.toLowerCase();
                    
                    if (postTitle.includes(searchTerm) || postContent.includes(searchTerm)) {
                        post.style.display = 'block';
                        foundPosts++;
                        
                        // Подсвечиваем найденный текст
                        highlightText(post, searchTerm);
                    } else {
                        post.style.display = 'none';
                    }
                });
                
                // Показываем результат поиска
                if (foundPosts > 0) {
                    showNotification(`Найдено постов: ${foundPosts}`);
                } else {
                    showNotification('По вашему запросу ничего не найдено', 'error');
                }
                
                // Сохраняем поисковый запрос
                localStorage.setItem('lastSearch', searchTerm);
            } else {
                // Показываем все посты, если поле поиска пустое
                const blogPosts = document.querySelectorAll('.blog-post');
                blogPosts.forEach(post => {
                    post.style.display = 'block';
                    removeHighlight(post);
                });
                
                // Удаляем сохраненный поисковый запрос
                localStorage.removeItem('lastSearch');
            }
        }
        
        // Обработчики событий
        searchButton.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Загружаем последний поисковый запрос
        const lastSearch = localStorage.getItem('lastSearch');
        if (lastSearch) {
            searchInput.value = lastSearch;
            // Выполняем поиск после небольшой задержки
            setTimeout(performSearch, 100);
        }
    }
}

// Функция подсветки текста
function highlightText(element, searchTerm) {
    const textNodes = getTextNodes(element);
    
    textNodes.forEach(node => {
        const text = node.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = text.replace(regex, '<mark>$1</mark>');
        
        if (highlightedText !== text) {
            const span = document.createElement('span');
            span.innerHTML = highlightedText;
            node.parentNode.replaceChild(span, node);
        }
    });
}

// Функция удаления подсветки
function removeHighlight(element) {
    const marks = element.querySelectorAll('mark');
    
    marks.forEach(mark => {
        const text = document.createTextNode(mark.textContent);
        mark.parentNode.replaceChild(text, mark);
    });
}

// Функция получения текстовых узлов
function getTextNodes(element) {
    const textNodes = [];
    
    function getNodes(node) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            textNodes.push(node);
        } else {
            for (let child of node.childNodes) {
                getNodes(child);
            }
        }
    }
    
    getNodes(element);
    return textNodes;
}

// Функция показа уведомлений
function showNotification(message, type = 'success') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Устанавливаем цвет фона в зависимости от типа
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }
    
    // Добавляем уведомление на страницу
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Функция для активной навигации
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Инициализация активной навигации
setActiveNavLink();