// Soski vs Zombies - Realistic Player Counter

// Реалистичные данные онлайна для CS 1.6 сервера
const realisticOnlinePatterns = {
    // Паттерны по времени суток (UTC+3 - Москва)
    patterns: [
        // Ночь (0-6 утра): 0-8 игроков
        { hour: 0, typical: [0, 2, 5, 8], max: 12 },
        { hour: 1, typical: [0, 1, 3, 6], max: 10 },
        { hour: 2, typical: [0, 1, 2, 4], max: 8 },
        { hour: 3, typical: [0, 1, 2, 3], max: 6 },
        { hour: 4, typical: [0, 1, 2, 3], max: 5 },
        { hour: 5, typical: [0, 1, 2, 3], max: 5 },
        { hour: 6, typical: [0, 1, 3, 5], max: 7 },
        
        // Утро (7-11): 1-15 игроков
        { hour: 7, typical: [1, 3, 6, 10], max: 14 },
        { hour: 8, typical: [2, 5, 8, 12], max: 16 },
        { hour: 9, typical: [3, 7, 11, 15], max: 18 },
        { hour: 10, typical: [4, 8, 13, 17], max: 20 },
        { hour: 11, typical: [5, 10, 15, 20], max: 22 },
        
        // День (12-17): 8-25 игроков
        { hour: 12, typical: [8, 12, 16, 20], max: 24 },
        { hour: 13, typical: [10, 14, 18, 22], max: 26 },
        { hour: 14, typical: [12, 16, 20, 24], max: 28 },
        { hour: 15, typical: [14, 18, 22, 26], max: 30 },
        { hour: 16, typical: [16, 20, 24, 28], max: 32 },
        { hour: 17, typical: [18, 22, 26, 30], max: 32 },
        
        // Вечер (18-23): 15-32 игроков
        { hour: 18, typical: [20, 24, 28, 32], max: 32 },
        { hour: 19, typical: [22, 26, 30, 32], max: 32 },
        { hour: 20, typical: [24, 28, 32, 32], max: 32 },
        { hour: 21, typical: [22, 26, 30, 32], max: 32 },
        { hour: 22, typical: [18, 22, 26, 30], max: 32 },
        { hour: 23, typical: [12, 16, 20, 25], max: 28 }
    ],
    
    // Выходные = больше игроков
    dayModifiers: {
        0: 1.2, // Воскресенье +20%
        1: 0.8, // Понедельник -20%
        2: 0.9, // Вторник -10%
        3: 1.0, // Среда 0%
        4: 1.1, // Четверг +10%
        5: 1.3, // Пятница +30%
        6: 1.4  // Суббота +40%
    }
};

// Получаем реалистичное количество игроков
function getRealisticPlayerCount() {
    const now = new Date();
    const moscowTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // UTC+3
    const hour = moscowTime.getHours();
    const day = moscowTime.getDay();
    
    // Находим паттерн для текущего часа
    const pattern = realisticOnlinePatterns.patterns.find(p => p.hour === hour) || 
                   realisticOnlinePatterns.patterns[0];
    
    // Выбираем случайное типичное значение
    const randomIndex = Math.floor(Math.random() * pattern.typical.length);
    let players = pattern.typical[randomIndex];
    
    // Применяем модификатор дня недели
    const modifier = realisticOnlinePatterns.dayModifiers[day] || 1.0;
    players = Math.round(players * modifier);
    
    // Гарантируем границы 0-32
    players = Math.max(0, Math.min(32, players));
    
    // Добавляем небольшой случайный шум (±2)
    players += Math.floor(Math.random() * 5) - 2;
    players = Math.max(0, Math.min(32, players));
    
    return players;
}

// Плавное изменение счетчика
function updatePlayerCount() {
    const playerElement = document.getElementById('players');
    const targetPlayers = getRealisticPlayerCount();
    const currentText = playerElement.textContent;
    const currentPlayers = parseInt(currentText.split('/')[0]) || 0;
    
    // Плавная анимация изменения
    const steps = 10;
    const step = (targetPlayers - currentPlayers) / steps;
    let stepCount = 0;
    
    const interval = setInterval(() => {
        stepCount++;
        const newValue = Math.round(currentPlayers + (step * stepCount));
        const displayValue = Math.max(0, Math.min(32, newValue));
        
        // Цвет в зависимости от заполненности
        let colorClass = 'green';
        if (displayValue < 10) colorClass = 'red';
        else if (displayValue < 20) colorClass = 'yellow';
        
        playerElement.innerHTML = `<span class="${colorClass}">${displayValue}</span>/32`;
        
        if (stepCount >= steps) {
            clearInterval(interval);
            // Корректируем финальное значение
            playerElement.innerHTML = `<span class="${colorClass}">${targetPlayers}</span>/32`;
        }
    }, 50);
}

// Основные функции сайта
function copyIP() {
    const ip = "46.174.52.22:27213";
    navigator.clipboard.writeText(ip)
        .then(() => {
            // Красивое уведомление вместо alert
            showNotification(`IP скопирован: ${ip}`);
        })
        .catch(err => {
            showNotification('Ошибка копирования', 'error');
        });
}

function connectCS() {
    if (confirm("Подключиться к серверу Soski vs Zombies?")) {
        // Пытаемся открыть через Steam
        window.location.href = "steam://connect/46.174.52.22:27213";
        
        // Резервный вариант
        setTimeout(() => {
            const copyText = "connect 46.174.52.22:27213";
            navigator.clipboard.writeText(copyText);
            showNotification("Команда подключения скопирована в буфер. Вставьте в консоль CS 1.6");
        }, 1000);
    }
}

// Красивые уведомления
function showNotification(message, type = 'success') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ed573' : '#ff4757'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для анимаций
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .green { color: #2ed573 !important; }
        .red { color: #ff4757 !important; }
        .yellow { color: #ffa502 !important; }
    `;
    document.head.appendChild(style);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log("Soski vs Zombies website loaded!");
    
    // Добавляем стили для уведомлений
    addNotificationStyles();
    
    // Инициализируем счетчик
    updatePlayerCount();
    
    // Обновляем каждые 2 минуты (реалистично)
    setInterval(updatePlayerCount, 120000);
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимация кнопок
    const buttons = document.querySelectorAll('.btn-copy, .btn-connect, .nav-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px) scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Функция для отображения времени сервера
function updateServerTime() {
    const timeElement = document.getElementById('server-time');
    if (timeElement) {
        const now = new Date();
        const moscowTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
        timeElement.textContent = moscowTime.toLocaleTimeString('ru-RU');
    }
}

// Обновляем время каждую секунду
setInterval(updateServerTime, 1000);
