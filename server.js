const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001; // Жестко задаем порт 3001

// ✅ COMPLETE CORS SOLUTION
app.use((req, res, next) => {
    const allowedOrigins = [
        'http://127.0.0.1:5500', 
        'http://localhost:3001', 
        'http://localhost:5500',
        'http://127.0.0.1:3001'
    ];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    
    next();
});

// Middleware
app.use(express.json());
app.use(express.static('.')); // Обслуживание статических файлов из корня

// Создаем папку data если её нет
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// API для сохранения данных
// Основные endpoints
app.post('/api/save-data', (req, res) => {
    try {
        const data = req.body;
        console.log('💾 Получены данные для сохранения:', {
            countries: data.countries?.length || 0,
            content: data.content ? 'есть' : 'нет',
            design: data.design ? 'есть' : 'нет'
        });
        
        // Просто возвращаем успех
        res.json({ 
            success: true, 
            message: 'Данные сохранены',
            received: {
                countries: data.countries?.length || 0,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера: ' + error.message 
        });
    }
});

app.get('/api/load-data', (req, res) => {
    try {
        // Пробуем загрузить из файла
        const filePath = path.join(__dirname, 'data', 'content.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.json({ 
                countries: [], 
                content: {},
                design: {},
                blocks: {},
                lastUpdate: null 
            });
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка загрузки данных' 
        });
    }
});

// API для загрузки данных
app.get('/api/load-data', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'content.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            console.log('📁 Данные загружены из файла:', parsedData.countries?.length, 'стран');
            res.json(parsedData);
        } else {
            console.log('📁 Файл данных не найден, возвращаем пустые данные');
            res.json({ countries: [], content: {}, lastUpdate: null });
        }
    } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        res.status(500).json({ success: false, message: 'Ошибка загрузки' });
    }
});

// API для входа
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('🔐 Попытка входа:', username);
        
        if (username === 'admin' && password === 'WorldTravel2024!') {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Логируем "отправку" email
            console.log('='.repeat(50));
            console.log('📧 EMAIL ОТПРАВЛЕН НА: narekgrigoryan424@gmail.com');
            console.log('🔐 КОД ДЛЯ ВХОДА:', code);
            console.log('⏰ Время:', new Date().toLocaleString());
            console.log('='.repeat(50));
            
            res.json({
                success: true,
                message: 'Код отправлен на email',
                debug_code: code,
                requires2FA: true
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Неверные учетные данные'
            });
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// API для проверки 2FA
app.post('/api/verify-2fa', (req, res) => {
    try {
        const { username, code } = req.body;
        console.log('🔐 Проверка 2FA:', username, code);
        
        // Для демо принимаем любой 6-значный код
        if (code && code.length === 6) {
            const sessionId = 'admin_session_' + Date.now();
            res.json({
                success: true,
                message: 'Аутентификация успешна',
                sessionId: sessionId
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Неверный код'
            });
        }
    } catch (error) {
        console.error('Ошибка проверки 2FA:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// API для отправки email с кодом 2FA (для полноты функционала)
app.post('/api/send-2fa-email', (req, res) => {
    try {
        const { email, code } = req.body;
        
        console.log('='.repeat(50));
        console.log('📧 СИМУЛЯЦИЯ ОТПРАВКИ EMAIL:');
        console.log('   Получатель:', email);
        console.log('   Код 2FA:', code);
        console.log('   Время:', new Date().toLocaleString());
        console.log('='.repeat(50));
        
        res.json({
            success: true,
            message: 'Код отправлен на email',
            debug: {
                email: email,
                code: code,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Ошибка отправки email:', error);
        res.status(500).json({ success: false, message: 'Ошибка отправки email' });
    }
});

// API для проверки сессии
app.post('/api/verify-session', (req, res) => {
    try {
        const { sessionId } = req.body;
        console.log('🔐 Проверка сессии:', sessionId);
        
        // Для демо всегда возвращаем успех для валидного sessionId
        if (sessionId && sessionId.startsWith('admin_session_')) {
            res.json({
                success: true,
                message: 'Сессия действительна',
                user: { username: 'admin' }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Недействительная сессия'
            });
        }
    } catch (error) {
        console.error('Ошибка проверки сессии:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// API для проверки здоровья
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running on port 3001!',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// API для получения текущих данных
app.get('/api/current-data', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'content.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            res.json(parsedData);
        } else {
            res.json({ 
                countries: [], 
                content: {},
                settings: {},
                design: {},
                lastUpdate: null 
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        res.status(500).json({ success: false, message: 'Ошибка загрузки данных' });
    }
});
// API для получения текущих данных (добавьте в server.js)
app.get('/api/current-data', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'content.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            res.json(parsedData);
        } else {
            res.json({ 
                countries: [], 
                content: {},
                settings: {},
                design: {},
                lastUpdate: null 
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        res.status(500).json({ success: false, message: 'Ошибка загрузки данных' });
    }
});
// Обслуживание всех HTML страниц
app.get('*', (req, res) => {
    const filePath = req.path === '/' ? '/index.html' : req.path;
    const fullPath = path.join(__dirname, filePath);
    
    if (fs.existsSync(fullPath) && fullPath.endsWith('.html')) {
        res.sendFile(fullPath);
    } else {
        res.status(404).send('Page not found');
    }
});

// Обработка ошибок порта
app.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.log('='.repeat(50));
        console.log('❌ ОШИБКА: Порт 3001 уже занят!');
        console.log('🔄 Решение:');
        console.log('   Выполните команду:');
        console.log('   lsof -ti:3001 | xargs kill -9');
        console.log('   или');
        console.log('   pkill -f "node server.js"');
        console.log('='.repeat(50));
        process.exit(1);
    } else {
        console.error('❌ Ошибка сервера:', error);
    }
});

// Обработка непредвиденных ошибок
process.on('uncaughtException', (error) => {
    console.error('❌ Непредвиденная ошибка:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Необработанный промис:', reason);
});

// Запуск сервера на порту 3001
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('🚀 СЕРВЕР ЗАПУЩЕН НА ПОРТУ 3001!');
    console.log('='.repeat(60));
    console.log('📍 Главная страница:');
    console.log(`   http://localhost:${PORT}`);
    console.log('');
    console.log('🔐 Админ-панель:');
    console.log(`   http://localhost:${PORT}/admin-login.html`);
    console.log(`   http://localhost:${PORT}/admin.html`);
    console.log('');
    console.log('👤 Учетные данные:');
    console.log('   Логин: admin');
    console.log('   Пароль: WorldTravel2024!');
    console.log('');
    console.log('📧 2FA коды будут показаны в консоли сервера');
    console.log('');
    console.log('⚡ Для остановки сервера: Ctrl + C');
    console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('');
    console.log('🛑 Остановка сервера...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('');
    console.log('🛑 Сервер завершает работу...');
    process.exit(0);
});