// ============================================
// 파트너정형외과 - 관리자 SPA 로직
// ============================================

let currentTab = 'dashboard';

// ── 초기화 ──
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// ── 인증 ──
async function checkAuth() {
    try {
        const res = await fetch('/api/admin/check');
        const data = await res.json();
        if (data.isAdmin) {
            showAdminPanel();
        } else {
            showLoginScreen();
        }
    } catch {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    switchTab('dashboard');
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    try {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
            showAdminPanel();
        } else {
            errorEl.textContent = data.error;
            errorEl.style.display = 'block';
        }
    } catch {
        errorEl.textContent = '서버 연결에 실패했습니다.';
        errorEl.style.display = 'block';
    }
}

async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    showLoginScreen();
}

// ── 탭 전환 ──
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.tab === tab);
    });

    const titles = {
        dashboard: '대시보드', notices: '공지사항 관리',
        news: '파트너 소식 관리', popups: '팝업 관리',
        consultations: '상담 문의 관리', settings: '설정'
    };
    document.getElementById('pageTitle').textContent = titles[tab] || tab;

    const loaders = {
        dashboard: loadDashboard, notices: loadNotices,
        news: loadNews, popups: loadPopups,
        consultations: loadConsultations, settings: loadSettings
    };
    if (loaders[tab]) loaders[tab]();
    closeSidebar();
    return false;
}

// ── 사이드바 (모바일) ──
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
}

// ══════════════════════════════════════
// 대시보드
// ══════════════════════════════════════
async function loadDashboard() {
    const body = document.getElementById('contentBody');
    try {
        const res = await fetch('/api/admin/dashboard');
        const d = await res.json();

        // 대기 중 배지 업데이트
        const badge = document.getElementById('pendingBadge');
        if (d.pendingConsultations > 0) {
            badge.textContent = d.pendingConsultations;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }

        body.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card accent">
            <div class="stat-icon">📋</div>
            <div class="stat-value">${d.totalNotices}</div>
            <div class="stat-label">공지사항</div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">📰</div>
            <div class="stat-value">${d.totalNews}</div>
            <div class="stat-label">파트너 소식</div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon">💬</div>
            <div class="stat-value">${d.totalConsultations}</div>
            <div class="stat-label">전체 상담</div>
          </div>
          <div class="stat-card danger">
            <div class="stat-icon">⏳</div>
            <div class="stat-value">${d.pendingConsultations}</div>
            <div class="stat-label">대기 중 상담</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🪟</div>
            <div class="stat-value">${d.activePopups} / ${d.totalPopups}</div>
            <div class="stat-label">활성 팝업</div>
          </div>
        </div>
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))">
          <div class="section-card">
            <div class="section-card-header"><h3>⚡ 빠른 이동</h3></div>
            <div style="padding:20px;display:grid;gap:10px">
              <button class="btn btn-ghost" onclick="switchTab('notices')" style="justify-content:flex-start;width:100%">📋 공지사항 관리</button>
              <button class="btn btn-ghost" onclick="switchTab('news')" style="justify-content:flex-start;width:100%">📰 파트너 소식 관리</button>
              <button class="btn btn-ghost" onclick="switchTab('popups')" style="justify-content:flex-start;width:100%">🪟 팝업 관리</button>
              <button class="btn btn-ghost" onclick="switchTab('consultations')" style="justify-content:flex-start;width:100%">💬 상담 문의 확인</button>
            </div>
          </div>
          <div class="section-card">
            <div class="section-card-header"><h3>ℹ️ 시스템 정보</h3></div>
            <div style="padding:20px;font-size:14px;color:var(--text-secondary);line-height:2">
              <p>🏥 <strong>파트너정형외과의원</strong></p>
              <p>📍 서울 송파구 송파대로 141, 2층</p>
              <p>📞 02-430-1410</p>
              <p>🌐 관리자 페이지 v1.0</p>
            </div>
          </div>
        </div>`;
    } catch {
        body.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>데이터를 불러오는데 실패했습니다.</p></div>';
    }
}

// ══════════════════════════════════════
// 공지사항
// ══════════════════════════════════════
async function loadNotices() {
    const body = document.getElementById('contentBody');
    try {
        const res = await fetch('/api/admin/notices');
        const data = await res.json();
        body.innerHTML = `
        <div class="section-card">
          <div class="section-card-header">
            <h3>공지사항 목록 (${data.length}건)</h3>
            <button class="btn btn-primary" onclick="openNoticeModal()">+ 새 공지 등록</button>
          </div>
          ${data.length === 0 ? '<div class="empty-state"><div class="empty-icon">📋</div><p>등록된 공지사항이 없습니다.</p></div>' : `
          <table class="admin-table">
            <thead><tr><th>번호</th><th>제목</th><th>작성일</th><th>조회</th><th>관리</th></tr></thead>
            <tbody>${data.map(n => `
              <tr>
                <td>${n.id}</td>
                <td style="color:var(--text-primary)">${n.title}</td>
                <td>${n.created_at}</td>
                <td>${n.views || 0}</td>
                <td class="actions">
                  <button class="btn btn-ghost btn-sm" onclick='openNoticeModal(${JSON.stringify(n).replace(/'/g, "&#39;")})'>수정</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteItem('notices',${n.id})">삭제</button>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>`}
        </div>`;
    } catch {
        body.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>로딩 실패</p></div>';
    }
}

function openNoticeModal(item = null) {
    const isEdit = !!item;
    document.getElementById('modalTitle').textContent = isEdit ? '공지사항 수정' : '새 공지사항 등록';
    document.getElementById('modalBody').innerHTML = `
      <div class="form-group">
        <label>제목 *</label>
        <input type="text" id="itemTitle" value="${isEdit ? escapeHtml(item.title) : ''}" placeholder="공지사항 제목을 입력하세요">
      </div>
      <div class="form-group">
        <label>내용</label>
        <textarea id="itemContent" placeholder="내용을 입력하세요" style="min-height:180px">${isEdit ? escapeHtml(item.content || '') : ''}</textarea>
      </div>`;
    document.getElementById('modalFooter').innerHTML = `
      <button class="btn btn-ghost" onclick="closeModal()">취소</button>
      <button class="btn btn-primary" onclick="saveNotice(${isEdit ? item.id : 'null'})">${isEdit ? '저장' : '등록'}</button>`;
    openModal();
}

async function saveNotice(id) {
    const title = document.getElementById('itemTitle').value;
    const content = document.getElementById('itemContent').value;
    if (!title) return alert('제목은 필수입니다.');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/notices/${id}` : '/api/admin/notices';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content }) });
    closeModal();
    loadNotices();
}

// ══════════════════════════════════════
// 뉴스
// ══════════════════════════════════════
async function loadNews() {
    const body = document.getElementById('contentBody');
    try {
        const res = await fetch('/api/admin/news');
        const data = await res.json();
        body.innerHTML = `
        <div class="section-card">
          <div class="section-card-header">
            <h3>파트너 소식 목록 (${data.length}건)</h3>
            <button class="btn btn-primary" onclick="openNewsModal()">+ 새 소식 등록</button>
          </div>
          ${data.length === 0 ? '<div class="empty-state"><div class="empty-icon">📰</div><p>등록된 소식이 없습니다.</p></div>' : `
          <table class="admin-table">
            <thead><tr><th>번호</th><th>제목</th><th>작성일</th><th>조회</th><th>관리</th></tr></thead>
            <tbody>${data.map(n => `
              <tr>
                <td>${n.id}</td>
                <td style="color:var(--text-primary)">${n.title}</td>
                <td>${n.created_at}</td>
                <td>${n.views || 0}</td>
                <td class="actions">
                  <button class="btn btn-ghost btn-sm" onclick='openNewsModal(${JSON.stringify(n).replace(/'/g, "&#39;")})'>수정</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteItem('news',${n.id})">삭제</button>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>`}
        </div>`;
    } catch {
        body.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>로딩 실패</p></div>';
    }
}

function openNewsModal(item = null) {
    const isEdit = !!item;
    document.getElementById('modalTitle').textContent = isEdit ? '소식 수정' : '새 소식 등록';
    document.getElementById('modalBody').innerHTML = `
      <div class="form-group">
        <label>제목 *</label>
        <input type="text" id="itemTitle" value="${isEdit ? escapeHtml(item.title) : ''}" placeholder="소식 제목을 입력하세요">
      </div>
      <div class="form-group">
        <label>내용</label>
        <textarea id="itemContent" placeholder="내용을 입력하세요" style="min-height:180px">${isEdit ? escapeHtml(item.content || '') : ''}</textarea>
      </div>`;
    document.getElementById('modalFooter').innerHTML = `
      <button class="btn btn-ghost" onclick="closeModal()">취소</button>
      <button class="btn btn-primary" onclick="saveNews(${isEdit ? item.id : 'null'})">${isEdit ? '저장' : '등록'}</button>`;
    openModal();
}

async function saveNews(id) {
    const title = document.getElementById('itemTitle').value;
    const content = document.getElementById('itemContent').value;
    if (!title) return alert('제목은 필수입니다.');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/news/${id}` : '/api/admin/news';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content }) });
    closeModal();
    loadNews();
}

// ══════════════════════════════════════
// 팝업 관리
// ══════════════════════════════════════
async function loadPopups() {
    const body = document.getElementById('contentBody');
    try {
        const res = await fetch('/api/admin/popups');
        const data = await res.json();
        body.innerHTML = `
        <div class="section-card">
          <div class="section-card-header">
            <h3>팝업 목록 (${data.length}건)</h3>
            <button class="btn btn-primary" onclick="openPopupModal()">+ 새 팝업 등록</button>
          </div>
          ${data.length === 0 ? '<div class="empty-state"><div class="empty-icon">🪟</div><p>등록된 팝업이 없습니다.</p></div>' : `
          <table class="admin-table">
            <thead><tr><th>번호</th><th>제목</th><th>시작일</th><th>종료일</th><th>상태</th><th>관리</th></tr></thead>
            <tbody>${data.map(p => `
              <tr>
                <td>${p.id}</td>
                <td style="color:var(--text-primary)">${p.title}</td>
                <td>${p.start_date}</td>
                <td>${p.end_date}</td>
                <td><span class="status-badge ${p.active ? 'active' : 'inactive'}">${p.active ? '활성' : '비활성'}</span></td>
                <td class="actions">
                  <button class="btn btn-ghost btn-sm" onclick='openPopupModal(${JSON.stringify(p).replace(/'/g, "&#39;")})'>수정</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteItem('popups',${p.id})">삭제</button>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>`}
        </div>`;
    } catch {
        body.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>로딩 실패</p></div>';
    }
}

function openPopupModal(item = null) {
    const isEdit = !!item;
    document.getElementById('modalTitle').textContent = isEdit ? '팝업 수정' : '새 팝업 등록';
    document.getElementById('modalBody').innerHTML = `
      <div class="form-group">
        <label>팝업 제목 *</label>
        <input type="text" id="popupTitle" value="${isEdit ? escapeHtml(item.title) : ''}" placeholder="팝업 제목">
      </div>
      <div class="form-group">
        <label>팝업 내용 (HTML 가능)</label>
        <textarea id="popupContent" placeholder="HTML 또는 텍스트 내용" style="min-height:160px">${isEdit ? escapeHtml(item.content || '') : ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>시작일</label>
          <input type="date" id="popupStart" value="${isEdit ? item.start_date : new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label>종료일</label>
          <input type="date" id="popupEnd" value="${isEdit ? item.end_date : '2099-12-31'}">
        </div>
      </div>
      <div class="form-group" style="display:flex;align-items:center;gap:10px">
        <label style="margin:0">활성 상태</label>
        <label class="toggle-switch">
          <input type="checkbox" id="popupActive" ${!isEdit || item.active ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>`;
    document.getElementById('modalFooter').innerHTML = `
      <button class="btn btn-ghost" onclick="closeModal()">취소</button>
      <button class="btn btn-primary" onclick="savePopup(${isEdit ? item.id : 'null'})">${isEdit ? '저장' : '등록'}</button>`;
    openModal();
}

async function savePopup(id) {
    const title = document.getElementById('popupTitle').value;
    const content = document.getElementById('popupContent').value;
    const start_date = document.getElementById('popupStart').value;
    const end_date = document.getElementById('popupEnd').value;
    const active = document.getElementById('popupActive').checked;
    if (!title) return alert('제목은 필수입니다.');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/popups/${id}` : '/api/admin/popups';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, start_date, end_date, active }) });
    closeModal();
    loadPopups();
}

// ══════════════════════════════════════
// 상담 문의
// ══════════════════════════════════════
async function loadConsultations() {
    const body = document.getElementById('contentBody');
    try {
        const res = await fetch('/api/admin/consultations');
        const data = await res.json();
        body.innerHTML = `
        <div class="section-card">
          <div class="section-card-header">
            <h3>상담 문의 목록 (${data.length}건)</h3>
          </div>
          ${data.length === 0 ? '<div class="empty-state"><div class="empty-icon">💬</div><p>상담 문의가 없습니다.</p></div>' : `
          <table class="admin-table">
            <thead><tr><th>번호</th><th>이름</th><th>연락처</th><th>희망 진료과</th><th>작성일</th><th>상태</th><th>관리</th></tr></thead>
            <tbody>${data.map(c => `
              <tr>
                <td>${c.id}</td>
                <td style="color:var(--text-primary)">${c.name}</td>
                <td>${c.phone}</td>
                <td>${c.department || '-'}</td>
                <td>${c.created_at}</td>
                <td><span class="status-badge ${c.status === '답변완료' ? 'done' : 'pending'}">${c.status}</span></td>
                <td class="actions">
                  <button class="btn btn-ghost btn-sm" onclick='viewConsultation(${JSON.stringify(c).replace(/'/g, "&#39;")})'>상세</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteItem('consultations',${c.id})">삭제</button>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>`}
        </div>`;
    } catch {
        body.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>로딩 실패</p></div>';
    }
}

function viewConsultation(c) {
    document.getElementById('modalTitle').textContent = `상담 상세 - ${c.name}`;
    document.getElementById('modalBody').innerHTML = `
      <dl class="consult-detail">
        <dt>이름</dt><dd>${c.name}</dd>
        <dt>연락처</dt><dd>${c.phone}</dd>
        <dt>희망 진료과</dt><dd>${c.department || '미선택'}</dd>
        <dt>희망 날짜</dt><dd>${c.preferred_date || '미선택'}</dd>
        <dt>상담 내용</dt><dd style="white-space:pre-wrap">${escapeHtml(c.message)}</dd>
        <dt>상태</dt><dd><span class="status-badge ${c.status === '답변완료' ? 'done' : 'pending'}">${c.status}</span></dd>
        ${c.reply ? `<dt>답변 내용</dt><dd style="white-space:pre-wrap">${escapeHtml(c.reply)}</dd><dt>답변일</dt><dd>${c.replied_at}</dd>` : ''}
      </dl>
      ${c.status !== '답변완료' ? `
      <div class="form-group" style="margin-top:16px">
        <label>답변 작성</label>
        <textarea id="replyContent" placeholder="답변을 입력해주세요" style="min-height:100px"></textarea>
      </div>` : ''}`;
    document.getElementById('modalFooter').innerHTML = `
      <button class="btn btn-ghost" onclick="closeModal()">닫기</button>
      ${c.status !== '답변완료' ? `<button class="btn btn-primary" onclick="sendReply(${c.id})">답변 보내기</button>` : ''}`;
    openModal();
}

async function sendReply(id) {
    const reply = document.getElementById('replyContent').value;
    if (!reply) return alert('답변 내용을 입력해주세요.');
    await fetch(`/api/admin/consultations/${id}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply })
    });
    closeModal();
    loadConsultations();
    loadDashboard(); // 배지 업데이트
}

// ══════════════════════════════════════
// 설정
// ══════════════════════════════════════
function loadSettings() {
    const body = document.getElementById('contentBody');
    body.innerHTML = `
    <div class="section-card">
      <div class="section-card-header"><h3>비밀번호 변경</h3></div>
      <div style="padding:24px;max-width:400px">
        <div class="form-group">
          <label>현재 비밀번호</label>
          <input type="password" id="currentPw" placeholder="현재 비밀번호">
        </div>
        <div class="form-group">
          <label>새 비밀번호</label>
          <input type="password" id="newPw" placeholder="새 비밀번호">
        </div>
        <div class="form-group">
          <label>새 비밀번호 확인</label>
          <input type="password" id="confirmPw" placeholder="새 비밀번호 확인">
        </div>
        <button class="btn btn-primary" onclick="changePassword()">비밀번호 변경</button>
      </div>
    </div>`;
}

async function changePassword() {
    const currentPassword = document.getElementById('currentPw').value;
    const newPassword = document.getElementById('newPw').value;
    const confirm = document.getElementById('confirmPw').value;
    if (!currentPassword || !newPassword) return alert('모든 필드를 입력해주세요.');
    if (newPassword !== confirm) return alert('새 비밀번호가 일치하지 않습니다.');
    try {
        const res = await fetch('/api/admin/password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await res.json();
        if (data.success) {
            alert('비밀번호가 변경되었습니다.');
            loadSettings();
        } else {
            alert(data.error || '변경 실패');
        }
    } catch {
        alert('서버 연결 실패');
    }
}

// ══════════════════════════════════════
// 공통 유틸
// ══════════════════════════════════════
async function deleteItem(type, id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' });
    const loaders = { notices: loadNotices, news: loadNews, popups: loadPopups, consultations: loadConsultations };
    if (loaders[type]) loaders[type]();
}

function openModal() {
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

// ESC키로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// 모달 바깥 클릭으로 닫기
document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});
