const express = require('express');
const router = express.Router();
const { loadDB, saveDB, nextId } = require('../db');

// ── 온라인 상담 등록 ──
router.post('/consultations', (req, res) => {
    const { name, phone, department, preferred_date, message } = req.body;
    if (!name || !phone || !message) {
        return res.status(400).json({ error: '이름, 연락처, 상담 내용은 필수입니다.' });
    }
    if (name.length > 50) return res.status(400).json({ error: '이름은 50자 이하로 입력해주세요.' });
    if (phone.length > 20) return res.status(400).json({ error: '연락처 형식이 올바르지 않습니다.' });
    if (message.length > 5000) return res.status(400).json({ error: '상담 내용은 5000자 이하로 입력해주세요.' });

    const db = loadDB();
    const newId = nextId(db, 'consultations');
    const consultation = {
        id: newId, name, phone,
        department: department || '',
        preferred_date: preferred_date || '',
        message, status: '대기중',
        reply: '',
        replied_at: '',
        created_at: new Date().toISOString().split('T')[0]
    };
    db.consultations.push(consultation);
    saveDB(db);
    res.json({ success: true, id: newId, message: '상담 신청이 접수되었습니다.' });
});

// ── 상담 목록 조회 (마스킹 처리) ──
router.get('/consultations', (req, res) => {
    const db = loadDB();
    const rows = db.consultations.slice().reverse().slice(0, 20);
    const masked = rows.map(r => ({
        ...r,
        name: r.name.charAt(0) + '**',
        phone: undefined
    }));
    res.json(masked);
});

// ── 공지사항 목록 ──
router.get('/notices', (req, res) => {
    const db = loadDB();
    res.json(db.notices.slice().reverse());
});

// ── 공지사항 상세 ──
router.get('/notices/:id', (req, res) => {
    const db = loadDB();
    const notice = db.notices.find(n => n.id === parseInt(req.params.id));
    if (!notice) return res.status(404).json({ error: '공지사항을 찾을 수 없습니다.' });
    // 조회수 증가
    notice.views = (notice.views || 0) + 1;
    saveDB(db);
    res.json(notice);
});

// ── 파트너 소식 목록 ──
router.get('/news', (req, res) => {
    const db = loadDB();
    res.json(db.news.slice().reverse());
});

// ── 파트너 소식 상세 ──
router.get('/news/:id', (req, res) => {
    const db = loadDB();
    const item = db.news.find(n => n.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: '소식을 찾을 수 없습니다.' });
    item.views = (item.views || 0) + 1;
    saveDB(db);
    res.json(item);
});

// ── 활성 팝업 조회 ──
router.get('/popups/active', (req, res) => {
    const db = loadDB();
    const today = new Date().toISOString().split('T')[0];
    const activePopups = (db.popups || []).filter(p =>
        p.active && p.start_date <= today && p.end_date >= today
    );
    res.json(activePopups);
});

module.exports = router;
