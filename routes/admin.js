const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { loadDB, saveDB, nextId } = require('../db');

// 입력값 길이 제한 상수
const MAX_TITLE = 200;
const MAX_CONTENT = 10000;
const MAX_PASSWORD = 100;

// 문자열 길이 검증 유틸
function validateLength(str, max, fieldName) {
    if (typeof str === 'string' && str.length > max) {
        return `${fieldName}은(는) ${max}자 이하로 입력해주세요.`;
    }
    return null;
}

// 세션 기반 인증 확인 미들웨어
function requireAuth(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.status(401).json({ error: '로그인이 필요합니다.' });
}

// ── 로그인 (bcrypt 비교) ──
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });

    const db = loadDB();
    if (username !== db.admin.username) {
        return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    // bcrypt 해시 비교 (기존 평문 호환)
    let match = false;
    if (db.admin.password.startsWith('$2a$') || db.admin.password.startsWith('$2b$')) {
        match = await bcrypt.compare(password, db.admin.password);
    } else {
        // 레거시 평문 비밀번호 → 자동으로 해시로 마이그레이션
        match = (password === db.admin.password);
        if (match) {
            db.admin.password = await bcrypt.hash(password, 10);
            saveDB(db);
            console.log('[Admin] 비밀번호가 bcrypt 해시로 마이그레이션되었습니다.');
        }
    }

    if (match) {
        req.session.isAdmin = true;
        res.json({ success: true, message: '로그인 성공' });
    } else {
        res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
});

// ── 로그아웃 ──
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// ── 인증 상태 확인 ──
router.get('/check', (req, res) => {
    res.json({ isAdmin: !!(req.session && req.session.isAdmin) });
});

// ── 대시보드 통계 ──
router.get('/dashboard', requireAuth, (req, res) => {
    const db = loadDB();
    const pendingConsults = db.consultations.filter(c => c.status === '대기중').length;
    res.json({
        totalNotices: db.notices.length,
        totalNews: db.news.length,
        totalConsultations: db.consultations.length,
        pendingConsultations: pendingConsults,
        totalPopups: (db.popups || []).length,
        activePopups: (db.popups || []).filter(p => p.active).length
    });
});

// ════════════════════════════
// 공지사항 CRUD
// ════════════════════════════
router.get('/notices', requireAuth, (req, res) => {
    const db = loadDB();
    res.json(db.notices.slice().reverse());
});

router.post('/notices', requireAuth, (req, res) => {
    const { title, content } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: '제목은 필수입니다.' });
    const err1 = validateLength(title, MAX_TITLE, '제목');
    const err2 = validateLength(content, MAX_CONTENT, '내용');
    if (err1) return res.status(400).json({ error: err1 });
    if (err2) return res.status(400).json({ error: err2 });

    const db = loadDB();
    const newId = nextId(db, 'notices');
    const notice = {
        id: newId, title: title.trim(), content: (content || '').trim(),
        views: 0, created_at: new Date().toISOString().split('T')[0]
    };
    db.notices.push(notice);
    saveDB(db);
    res.json({ success: true, notice });
});

router.put('/notices/:id', requireAuth, (req, res) => {
    const err1 = validateLength(req.body.title, MAX_TITLE, '제목');
    const err2 = validateLength(req.body.content, MAX_CONTENT, '내용');
    if (err1) return res.status(400).json({ error: err1 });
    if (err2) return res.status(400).json({ error: err2 });

    const db = loadDB();
    const notice = db.notices.find(n => n.id === parseInt(req.params.id));
    if (!notice) return res.status(404).json({ error: '공지사항을 찾을 수 없습니다.' });
    if (req.body.title) notice.title = req.body.title.trim();
    if (req.body.content !== undefined) notice.content = req.body.content.trim();
    saveDB(db);
    res.json({ success: true, notice });
});

router.delete('/notices/:id', requireAuth, (req, res) => {
    const db = loadDB();
    const idx = db.notices.findIndex(n => n.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: '공지사항을 찾을 수 없습니다.' });
    db.notices.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
});

// ════════════════════════════
// 뉴스 CRUD
// ════════════════════════════
router.get('/news', requireAuth, (req, res) => {
    const db = loadDB();
    res.json(db.news.slice().reverse());
});

router.post('/news', requireAuth, (req, res) => {
    const { title, content } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: '제목은 필수입니다.' });
    const err1 = validateLength(title, MAX_TITLE, '제목');
    const err2 = validateLength(content, MAX_CONTENT, '내용');
    if (err1) return res.status(400).json({ error: err1 });
    if (err2) return res.status(400).json({ error: err2 });

    const db = loadDB();
    const newId = nextId(db, 'news');
    const item = {
        id: newId, title: title.trim(), content: (content || '').trim(),
        views: 0, created_at: new Date().toISOString().split('T')[0]
    };
    db.news.push(item);
    saveDB(db);
    res.json({ success: true, item });
});

router.put('/news/:id', requireAuth, (req, res) => {
    const err1 = validateLength(req.body.title, MAX_TITLE, '제목');
    const err2 = validateLength(req.body.content, MAX_CONTENT, '내용');
    if (err1) return res.status(400).json({ error: err1 });
    if (err2) return res.status(400).json({ error: err2 });

    const db = loadDB();
    const item = db.news.find(n => n.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: '소식을 찾을 수 없습니다.' });
    if (req.body.title) item.title = req.body.title.trim();
    if (req.body.content !== undefined) item.content = req.body.content.trim();
    saveDB(db);
    res.json({ success: true, item });
});

router.delete('/news/:id', requireAuth, (req, res) => {
    const db = loadDB();
    const idx = db.news.findIndex(n => n.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: '소식을 찾을 수 없습니다.' });
    db.news.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
});

// ════════════════════════════
// 팝업 CRUD
// ════════════════════════════
router.get('/popups', requireAuth, (req, res) => {
    const db = loadDB();
    res.json((db.popups || []).slice().reverse());
});

router.post('/popups', requireAuth, (req, res) => {
    const { title, content, active, start_date, end_date } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: '제목은 필수입니다.' });
    const err1 = validateLength(title, MAX_TITLE, '제목');
    const err2 = validateLength(content, MAX_CONTENT, '내용');
    if (err1) return res.status(400).json({ error: err1 });
    if (err2) return res.status(400).json({ error: err2 });

    const db = loadDB();
    if (!db.popups) db.popups = [];
    const newId = nextId(db, 'popups');
    const popup = {
        id: newId, title: title.trim(), content: (content || '').trim(),
        active: active !== false,
        start_date: start_date || new Date().toISOString().split('T')[0],
        end_date: end_date || '2099-12-31',
        created_at: new Date().toISOString().split('T')[0]
    };
    db.popups.push(popup);
    saveDB(db);
    res.json({ success: true, popup });
});

router.put('/popups/:id', requireAuth, (req, res) => {
    const err1 = validateLength(req.body.title, MAX_TITLE, '제목');
    const err2 = validateLength(req.body.content, MAX_CONTENT, '내용');
    if (err1) return res.status(400).json({ error: err1 });
    if (err2) return res.status(400).json({ error: err2 });

    const db = loadDB();
    const popup = (db.popups || []).find(p => p.id === parseInt(req.params.id));
    if (!popup) return res.status(404).json({ error: '팝업을 찾을 수 없습니다.' });
    if (req.body.title !== undefined) popup.title = req.body.title.trim();
    if (req.body.content !== undefined) popup.content = req.body.content.trim();
    if (req.body.active !== undefined) popup.active = req.body.active;
    if (req.body.start_date) popup.start_date = req.body.start_date;
    if (req.body.end_date) popup.end_date = req.body.end_date;
    saveDB(db);
    res.json({ success: true, popup });
});

router.delete('/popups/:id', requireAuth, (req, res) => {
    const db = loadDB();
    const idx = (db.popups || []).findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: '팝업을 찾을 수 없습니다.' });
    db.popups.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
});

// ════════════════════════════
// 상담 관리
// ════════════════════════════
router.get('/consultations', requireAuth, (req, res) => {
    const db = loadDB();
    res.json(db.consultations.slice().reverse());
});

router.put('/consultations/:id/reply', requireAuth, (req, res) => {
    const { reply } = req.body;
    if (!reply || !reply.trim()) return res.status(400).json({ error: '답변 내용을 입력해주세요.' });
    const err = validateLength(reply, MAX_CONTENT, '답변');
    if (err) return res.status(400).json({ error: err });

    const db = loadDB();
    const consult = db.consultations.find(c => c.id === parseInt(req.params.id));
    if (!consult) return res.status(404).json({ error: '상담을 찾을 수 없습니다.' });
    consult.reply = reply.trim();
    consult.status = '답변완료';
    consult.replied_at = new Date().toISOString().split('T')[0];
    saveDB(db);
    res.json({ success: true, consult });
});

router.delete('/consultations/:id', requireAuth, (req, res) => {
    const db = loadDB();
    const idx = db.consultations.findIndex(c => c.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: '상담을 찾을 수 없습니다.' });
    db.consultations.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
});

// ── 비밀번호 변경 (bcrypt) ──
router.put('/password', requireAuth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' });
    const err = validateLength(newPassword, MAX_PASSWORD, '새 비밀번호');
    if (err) return res.status(400).json({ error: err });
    if (newPassword.length < 4) return res.status(400).json({ error: '새 비밀번호는 4자 이상이어야 합니다.' });

    const db = loadDB();

    // bcrypt 또는 평문 비교
    let match = false;
    if (db.admin.password.startsWith('$2a$') || db.admin.password.startsWith('$2b$')) {
        match = await bcrypt.compare(currentPassword, db.admin.password);
    } else {
        match = (currentPassword === db.admin.password);
    }

    if (!match) {
        return res.status(400).json({ error: '현재 비밀번호가 올바르지 않습니다.' });
    }
    db.admin.password = await bcrypt.hash(newPassword, 10);
    saveDB(db);
    res.json({ success: true, message: '비밀번호가 변경되었습니다.' });
});

module.exports = router;
