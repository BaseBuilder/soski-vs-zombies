// Soski vs Zombies - Real Player List from Server

// Конфигурация сервера
const SERVER_IP = "46.174.52.22";
const SERVER_PORT = "27213";
const SERVER_ADDRESS = `${SERVER_IP}:${SERVER_PORT}`;

// Получение информации о сервере через A2S Query
async function getServerInfo() {
    try {
        // Используем прокси для обхода CORS
        const response = await fetch(`https://api.gametracker.rs/demo/json/server_info/${SERVER_IP}:${SERVER_PORT}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching server info:', error);
        return null;
    }
}

// Получение списка игроков
async function getPlayerList() {
    try {
        // Альтернативный API
        const response = await fetch(`https://cache.gametracker.rs/server_info/${SERVER_IP}:${SERVER_PORT}/players.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching player list:', error);
        return null;
    }
}

// Обновление информации о сервере
async function updateServerStatus() {
    const playersElement = document.getElementById('players');
    const playerListElement = document.querySelector('.players-list');
    
    try {
        // Получаем общую информацию
        const serverInfo = await getServerInfo();
        
        if (serverInfo && serverInfo.online === "1") {
            const currentPlayers = serverInfo.players || "0";
            const maxPlayers = serverInfo.maxplayers || "32";
            
            // Обновляем счетчик
            playersElement.innerHTML = `<span class="green">${currentPlayers}</span>/${maxPlayers}`;
            
            // Получаем список игроков
            const playerList = await getPlayerList();
            
            if (playerList && playerList.players && playerList.players.length > 0) {
                // Сортируем игроков по имени
                const sortedPlayers = playerList.players.sort((a, b) => {
                    if (a.name && b.name) {
                        return a.name.localeCompare(b.name);
                    }
                    return 0;
                });
                
                // Отображаем список игроков
                playerListElement.innerHTML = `
                    <div class="players-header">
                        <span>Игрок</span>
                        <span>Фраги</span>
                        <span>Время</span>
                    </div>
                    ${sortedPlayers.map(player => `
                        <div class="player-row">
                            <span class="player-name">
                                <i class="fas fa-user"></i>
                                ${escapeHtml(player.name || 'Unknown')}
                            </span>
                            <span class="player-score">${player.score || '0'}</span>
                            <span class="player-time">${formatTime(player.time || '0')}</span>
                        </div>
                    `).join('')}
                `;
            } else {
                playerListElement.innerHTML = `
                    <div class="no-players">
                        <i class="fas fa-users-slash"></i>
                        <p>На сервере нет игроков</p>
                    </div>
                `;
            }
            
            // Обновляем статус сервера
            updateServerStatusUI(true);
            
        } else {
            // Сервер оффлайн
            playersElement.innerHTML = `<span class="red">0</span>/32`;
            playerListElement.innerHTML = `
                <div class="server-offline">
                    <i class="fas fa-server"></i>
                    <h3>Сервер оффлайн</h3>
                    <p>Попробуйте подключиться позже</p>
                </div>
            `;
            updateServerStatusUI(false);
        }
        
    } catch (error) {
        console.error('Error updating server status:', error);
        
        // Заглушка при ошибке
        playersElement.innerHTML = `<span class="yellow">?</span>/32`;
        playerListElement.innerHTML = `
            <div class="server-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Не удалось получить данные сервера</p>
            </div>
        `;
    }
}

// Обновление UI статуса сервера
function updateServerStatusUI(isOnline) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
        if (isOnline) {
            statusIndicator.className = 'status-indicator online';
            statusIndicator.style.background = '#2ed573';
            statusText.innerHTML = `ОНЛАЙН • ИГРОКОВ: <span id="players"></span>`;
        } else {
            statusIndicator.className = 'status-indicator offline';
            statusIndicator.style.background = '#ff4757';
            statusText.innerHTML = `ОФФЛАЙН • ИГРОКОВ: <span id="players"></span>`;
        }
    }
}

// Вспомогательные функции
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}ч ${minutes}м`;
    } else {
        return `${minutes}м`;
    }
}

// Основные функции сайта
function copyIP() {
    navigator.clipboard.writeText(SERVER_ADDRESS)
        .then(() => {
            showNotification(`IP скопирован: ${SERVER_ADDRESS}`);
        })
        .catch(err => {
            showNotification('Ошибка копирования', 'error');
        });
}

function connectCS() {
    if (confirm("Подключиться к серверу Soski vs Zombies?")) {
        window.location.href = `steam://connect/${SERVER_ADDRESS}`;
        
        setTimeout(() => {
            navigator.clipboard.writeText(`connect ${SERVER_ADDRESS}`);
            showNotification("Команда подключения скопирована в буфер");
        }, 1000);
    }
}

// Уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log("Soski vs Zombies website initialized");
    
    // Первое обновление
    updateServerStatus();
    
    // Обновляем каждые 30 секунд
    setInterval(updateServerStatus, 30000);
    
    // Добавляем кнопку обновления вручную
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'btn-refresh';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить';
    refreshBtn.onclick = updateServerStatus;
    
    const playersSection = document.querySelector('.players-section');
    if (playersSection) {
        const h2 = playersSection.querySelector('h2');
        if (h2) {
            refreshBtn.style.cssText = `
                margin-left: 15px;
                background: #3742fa;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            `;
            h2.appendChild(refreshBtn);
        }
    }
    
    // Анимация кнопок
    document.querySelectorAll('.btn-copy, .btn-connect, .nav-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
});

// Добавляем стили для списка игроков
const playerStyles = `
    .players-list {
        max-width: 800px;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 15px;
        border: 2px solid #2ed573;
    }
    
    .players-header {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        padding: 10px;
        background: rgba(46, 213, 115, 0.1);
        border-radius: 8px;
        margin-bottom: 10px;
        font-weight: bold;
        color: #2ed573;
    }
    
    .player-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        padding: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        align-items: center;
    }
    
    .player-row:last-child {
        border-bottom: none;
    }
    
    .player-row:hover {
        background: rgba(46, 213, 115, 0.05);
    }
    
    .player-name {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #ffffff;
    }
    
    .player-score {
        color: #ffa502;
        text-align: center;
    }
    
    .player-time {
        color: #70a1ff;
        text-align: center;
    }
    
    .no-players, .server-offline, .server-error {
        text-align: center;
        padding: 40px;
        color: #a4b0be;
    }
    
    .no-players i, .server-offline i, .server-error i {
        font-size: 48px;
        margin-bottom: 20px;
        color: #747d8c;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = playerStyles;
document.head.appendChild(styleSheet);
