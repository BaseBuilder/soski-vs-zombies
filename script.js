// Основные функции сайта
function copyIP() {
    const ip = "46.174.52.22:27213";
    navigator.clipboard.writeText(ip)
        .then(() => {
            alert("IP скопирован: " + ip);
        })
        .catch(err => {
            console.error('Ошибка копирования: ', err);
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
            alert("Команда подключения скопирована в буфер. Вставьте в консоль CS 1.6");
        }, 1000);
    }
}

// Обновление онлайн игроков (заглушка)
function updatePlayerCount() {
    const playerElement = document.getElementById('players');
    const fakeCount = Math.floor(Math.random() * 15) + 10; // Рандом 10-25
    const maxPlayers = 32;
    playerElement.textContent = `${fakeCount}/${maxPlayers}`;
    
    // Обновляем каждые 30 секунд
    setTimeout(updatePlayerCount, 30000);
}

// Анимация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log("Soski vs Zombies website loaded!");
    
    // Запускаем обновление онлайн
    updatePlayerCount();
    
    // Добавляем эффекты на кнопки
    const buttons = document.querySelectorAll('.nav-btn, .btn-copy, .btn-connect');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
    
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
});

// Таймер (опционально)
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU');
    // Можно добавить отображение времени где-нибудь
}

setInterval(updateTime, 1000);
