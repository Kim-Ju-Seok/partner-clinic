const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'partner-ortho-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24시간
    }
}));

// 정적 파일 (public 폴더)
app.use(express.static(path.join(__dirname, 'public')));

// API 라우트
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// Admin 페이지
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// SPA fallback - 모든 요청을 index.html로
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 포트 충돌 자동 처리
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`\n🏥 파트너정형외과 서버가 실행되었습니다!`);
        console.log(`📍 메인: http://localhost:${port}`);
        console.log(`🔧 관리자: http://localhost:${port}/admin`);
        console.log(`   관리자 계정: admin / admin1234\n`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️  포트 ${port}이(가) 사용 중입니다. 포트 ${port + 1}로 시도합니다...`);
            startServer(port + 1);
        } else {
            console.error('서버 오류:', err);
        }
    });
}

startServer(PORT);
