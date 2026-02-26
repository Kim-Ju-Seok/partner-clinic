/**
 * 개발 전용 서버 (Live Reload)
 * ─────────────────────────────────────────────
 * public/ 폴더의 SPA를 메인 페이지로 제공하며,
 * CSS/HTML/JS 파일이 변경되면 브라우저가 자동으로 새로고침됩니다.
 *
 * 실행: npm run live
 * 접속: http://localhost:4000
 */

const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const app = express();
const PORT = 3000;

// ── Live Reload 서버 설정 ──
// public 폴더 내 CSS, HTML, JS 파일이 변경되면 브라우저에 자동 반영
const liveReloadServer = livereload.createServer({
    exts: ['html', 'css', 'js', 'png', 'jpg', 'gif', 'svg'],
    delay: 100
});

// public 폴더를 감시 대상으로 지정
liveReloadServer.watch(path.join(__dirname, 'public'));

// Express에 Live Reload 미들웨어 연결
app.use(connectLivereload());

// ── 정적 파일 서빙 ──
// public 폴더의 파일을 정적으로 서빙
app.use(express.static(path.join(__dirname, 'public')));

// ── API 라우트 (기존 서버 기능 유지) ──
try {
    const apiRoutes = require('./routes/api');
    const adminRoutes = require('./routes/admin');
    app.use('/api', apiRoutes);
    app.use('/api/admin', adminRoutes);
} catch (e) {
    console.log('⚠️  API 라우트 로딩 생략 (옵션)');
}

// ── SPA 라우팅 ──
// 모든 요청을 public/index.html로 보내서 SPA가 처리
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── 서버 시작 ──
app.listen(PORT, () => {
    console.log('');
    console.log('🏥 ═══════════════════════════════════════════');
    console.log('   파트너정형외과 개발 서버 (Live Reload)');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log(`   📍 접속 주소: http://localhost:${PORT}`);
    console.log('   📝 public/ 폴더의 CSS/HTML/JS 수정 후 저장하면 자동 반영');
    console.log('   🛑 종료: Ctrl + C');
    console.log('');
    console.log('═══════════════════════════════════════════════');
});
