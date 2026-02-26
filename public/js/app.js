// ============================================
// 파트너 정형외과 - SPA 라우팅 + 메인 로직
// (리팩토링: fetch 기반 페이지 로딩)
// ============================================

// ── 초기화 ──
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
  observeAnimations();
}

// ── 라우팅 (fetch 기반) ──
function handleRoute() {
  const hash = window.location.hash;
  const match = hash.match(/^#page=(.+)$/);
  if (match && PAGES[match[1]]) {
    showSubPage(match[1]);
  } else {
    showHomePage();
  }
}

function navigateTo(pageKey) {
  if (pageKey === 'home') {
    window.location.hash = '';
    showHomePage();
  } else {
    window.location.hash = `page=${pageKey}`;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMobileMenu();
  return false;
}

function showHomePage() {
  document.getElementById('mainContent').innerHTML = renderHomePage();
  updateActiveMenu('');
  observeAnimations();
}

// ★ 핵심 변경: fetch로 개별 HTML 파일 로딩
async function showSubPage(key) {
  const page = PAGES[key];
  if (!page) return;

  // 로딩 스피너 표시
  const wrapper = renderSubLayout(key, page.title, page.parent, '<div class="page-loader"><div class="loader-spinner"></div><p>페이지 로딩 중...</p></div>');
  document.getElementById('mainContent').innerHTML = wrapper;
  updateActiveMenu(key);

  try {
    const response = await fetch(`/pages/${key}.html`);
    if (!response.ok) throw new Error('Page not found');
    const html = await response.text();
    // 콘텐츠 영역에만 삽입
    const contentEl = document.querySelector('.sub-content');
    if (contentEl) {
      contentEl.innerHTML = html;
      // 페이지 내 script 태그 실행
      contentEl.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  } catch (err) {
    const contentEl = document.querySelector('.sub-content');
    if (contentEl) {
      contentEl.innerHTML = `<div class="info-box"><h4>⚠️ 페이지 로딩 실패</h4><p>페이지를 불러오지 못했습니다. 서버가 실행 중인지 확인해주세요.</p></div>`;
    }
  }
}

function updateActiveMenu(key) {
  document.querySelectorAll('.main-nav > ul > li').forEach((li, i) => {
    const menuKey = MENU_DATA[i].key;
    li.classList.toggle('active', key && key.startsWith(menuKey + '_'));
  });
}

// ── 메인 페이지 렌더링 ──
function renderHomePage() {
  return `
  <div id="main_visual">
    <video src="/video/mv.mp4" autoplay muted loop playsinline></video>
  </div>
  <div class="wrap" id="ma">
    <h4>척추·관절 건강 <span class="">파트너</span> 정형외과</h4>
    <div class="gra_bg">뛰어난 의료진과 첨단 의료시스템으로 꼼꼼하게 진료하는 파트너정형외과는<br> 올바르고 정확한 진단, 정직한 진료로 환자분들의 건강을 책임지겠습니다.</div>
    <dl class="dlw js">
      <dd><a href="#page=2_1" onclick="navigateTo('2_1')"><i><img src="/img/ma_icon1.png" alt="미세침습 수술클리닉"></i>
          <p>미세침습<br>수술클리닉</p>
        </a></dd>
      <dd><a href="#page=3_1" onclick="navigateTo('3_1')"><i><img src="/img/ma_icon2.png" alt="비수술 클리닉"></i>
          <p>비수술<br>클리닉</p>
        </a></dd>
      <dd><a href="#page=4_1" onclick="navigateTo('4_1')"><i><img src="/img/ma_icon3.png" alt="척추·관절 클리닉"></i>
          <p>척추·관절<br>클리닉</p>
        </a></dd>
      <dd><a href="#page=5_1" onclick="navigateTo('5_1')"><i><img src="/img/ma_icon4.png" alt="도수·물리치료 클리닉"></i>
          <p>도수·물리치료<br>클리닉</p>
        </a></dd>
    </dl>
  </div>

  <div class="wrap" id="mb">
    <dl class="dlw js br">
      <dt class="vc">
        <figure><img src="/img/mb_img.png" alt="파트너 정형외과"></figure>
      </dt>
      <dd>
        <h4>파트너 정형외과<br>환자중심의 <b>환자 개별화 치료</b></h4>
        <dl class="dlw js">
          <dd><strong>1</strong>
            <p>전문의와의<br>자세한 문진</p>
          </dd>
          <dt class="vc"><i><img src="/img/next_icon.png" alt="다음"></i></dt>
          <dd><strong>2</strong>
            <p>영상학적<br>검진</p>
          </dd>
          <dt class="vc"><i><img src="/img/next_icon.png" alt="다음"></i></dt>
          <dd><strong>3</strong>
            <p>생체역학<br>검사</p>
          </dd>
          <dt class="vc"><i><img src="/img/next_icon.png" alt="다음"></i></dt>
          <dd><strong>4</strong>
            <p>숙련된 전문의의<br>신체 검사 및<br>기능(동작) 검사</p>
          </dd>
        </dl>
        <article>
          환자 중심의 치료를 위해서는 현재 환자가 가지고 있는 통증과 문제의 <br>'맥락'이 파악되어야 합니다. 이를 통해 환자 개개인에 맞는 특징과 목표에 따라서<br class="nom"> 치료의 방법과 구성, 치료기간 등을 계획하게 됩니다.
        </article>
      </dd>
    </dl>
  </div>

  <div class="wrap" id="mc">
    <dl class="dlw js">
      <dd>
        <h4>파트너의<br><b>통증 치료 단계</b></h4>
        <p>파트너는 특정치료만을 고집하지 않고,<br>치료 목적에 도움이 될 수 있도록<br>통합치료로 구성됩니다.</p>
      </dd>
      <dt class="vc">
        <figure><img src="/img/mc_img.png" alt="통증 치료 단계"></figure>
      </dt>
    </dl>
  </div>

  <div class="wrap" id="md">
    <i><img src="/img/logo_icon.svg" alt="로고 아이콘"></i>
    <h4>대학병원 임상교수 출신 전문의에 의한 수준 높은 치료!</h4>
    <p>수술 및 비수술적 임상경험이 풍부한 실력있는 전문의가<br>나에게 꼭 필요한 비수술치료를 시행합니다.</p>
  </div>

  </div>`;
}


// ── 스크롤 ──
function handleScroll() {
  const header = document.getElementById('header');
  const scrollTop = document.getElementById('scrollTopBtn');
  if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  if (scrollTop) scrollTop.classList.toggle('visible', window.scrollY > 400);
}

// ── 팝업 (API 동적 로딩) ──
let activePopupsData = [];
let currentPopupIdx = 0;

async function loadActivePopup() {
  const closed = localStorage.getItem('popupClosed');
  if (closed) {
    const closedTime = parseInt(closed);
    if (Date.now() - closedTime < 24 * 60 * 60 * 1000) return;
    else localStorage.removeItem('popupClosed');
  }

  try {
    const res = await fetch('/api/popups/active');
    activePopupsData = await res.json();
    if (activePopupsData.length === 0) return;

    currentPopupIdx = 0;
    renderPopupByTab();

    setTimeout(() => {
      document.getElementById('popupOverlay').classList.add('active');
    }, 500);
  } catch (e) {
    console.error('팝업 로딩 실패:', e);
  }
}

function renderPopupByTab() {
  const overlay = document.getElementById('popupOverlay');
  const p = activePopupsData[currentPopupIdx];

  if (!overlay.querySelector('.popup-box')) {
    overlay.innerHTML = `
      <div class="popup-box">
        <div class="popup-header">
          <div style="font-size:12px; margin-bottom:5px; opacity:0.8; letter-spacing:1px;">PARTNER ORTHOPEDICS</div>
          <h3 id="popupTitle">${p.title}</h3>
        </div>
        <div class="popup-body">
          <div class="notice-content" id="popupContent">${p.content}</div>
        </div>
        <div class="popup-tabs-grid" id="popupTabs"></div>
        <div class="popup-footer">
          <label><input type="checkbox" id="popupNoShowCheck"> 24시간 동안 보지 않기</label>
          <button class="close-btn" onclick="closePopup()">닫기</button>
        </div>
      </div>
    `;
  } else {
    document.getElementById('popupTitle').innerText = p.title;
    document.getElementById('popupContent').innerHTML = p.content;
  }

  // 탭 버튼 업데이트
  const tabsHtml = activePopupsData.map((item, idx) => `
    <div class="popup-tab-btn ${idx === currentPopupIdx ? 'active' : ''}" onclick="switchPopupTab(${idx})">
      ${item.title}
    </div>
  `).join('');
  document.getElementById('popupTabs').innerHTML = tabsHtml;
}

function switchPopupTab(idx) {
  if (currentPopupIdx === idx) return;
  currentPopupIdx = idx;
  renderPopupByTab();
}

function closePopup() {
  const isChecked = document.getElementById('popupNoShowCheck')?.checked;
  if (isChecked) {
    localStorage.setItem('popupClosed', Date.now());
  }
  document.getElementById('popupOverlay').classList.remove('active');
}

// ── 모바일 메뉴 ──
function toggleMobileMenu() {
  document.getElementById('mainNav').classList.toggle('active');
  document.getElementById('mobileToggle').classList.toggle('active');
  document.getElementById('mobileOverlay').classList.toggle('active');
}
function closeMobileMenu() {
  ['mainNav', 'mobileToggle', 'mobileOverlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
}
document.addEventListener('click', (e) => {
  if (window.innerWidth > 768) return;
  const parentLi = e.target.closest('.main-nav > ul > li');
  if (parentLi && e.target.tagName === 'A' && e.target.parentElement === parentLi) {
    const dd = parentLi.querySelector('.dropdown');
    if (dd) { e.preventDefault(); dd.classList.toggle('mobile-show'); }
  }
});

// ── 폼 제출 (API 연동) ──
async function submitConsult() {
  const name = document.getElementById('consultName')?.value;
  const phone = document.getElementById('consultPhone')?.value;
  const msg = document.getElementById('consultMsg')?.value;
  const dept = document.getElementById('consultDept')?.value;
  const date = document.getElementById('consultDate')?.value;

  if (!name || !phone || !msg) {
    alert('이름, 연락처, 상담 내용은 필수 입력 항목입니다.');
    return;
  }

  try {
    const res = await fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, department: dept, preferred_date: date, message: msg })
    });
    const data = await res.json();
    if (data.success) {
      alert('✅ 상담 신청이 접수되었습니다.\n빠른 시간 내에 연락드리겠습니다.');
      document.getElementById('consultName').value = '';
      document.getElementById('consultPhone').value = '';
      document.getElementById('consultMsg').value = '';
      // 목록 새로고침
      if (typeof loadConsultations === 'function') loadConsultations();
    } else {
      alert('접수 실패: ' + (data.error || '알 수 없는 오류'));
    }
  } catch (err) {
    alert('서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.');
  }
}

// ── 게시판 상세보기 ──
async function showBoardDetail(type, id) {
  const contentEl = document.querySelector('.sub-content');
  if (!contentEl) return;

  // 로딩 표시
  contentEl.innerHTML = '<div class="page-loader"><div class="loader-spinner"></div><p>내용을 불러오는 중...</p></div>';

  try {
    const res = await fetch(`/ api / ${type}/${id}`);
    if (!res.ok) throw new Error('Not found');
    const post = await res.json();

    const title = type === 'notices' ? '공지사항' : '파트너 소식';
    const backBtn = `<button class="btn btn-outline" style="margin-bottom:20px; padding:6px 12px; font-size:14px;" onclick="showSubPage('${type === 'notices' ? '6_1' : '6_4'}')">← 목록으로</button>`;

    contentEl.innerHTML = `
      <div class="post-detail animate-on-scroll visible">
        ${backBtn}
        <div class="post-header" style="border-bottom:2px solid var(--primary); padding-bottom:15px; margin-bottom:20px;">
          <h2 style="margin-bottom:10px; border:none; text-align:left; font-size:24px;">${escapeHtml(post.title)}</h2>
          <div style="display:flex; justify-content:space-between; color:var(--text-light); font-size:14px;">
            <span>📅 작성일: ${post.created_at?.split('T')[0] || post.created_at}</span>
            <span>👁️ 조회수: ${post.views}</span>
          </div>
        </div>
        <div class="post-body" style="line-height:1.8; color:var(--text); min-height:300px; white-space:pre-wrap;">${escapeHtml(post.content)}</div>
        <div style="margin-top:40px; text-align:center; border-top:1px solid var(--gray-200); padding-top:20px;">
          ${backBtn}
        </div>
      </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    contentEl.innerHTML = `<div class="info-box"><h4>⚠️ 오류</h4><p>게시글을 불러오지 못했습니다.</p></div>`;
  }
}

// ── 유틸리티 ──
function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ── 스크롤 애니메이션 ──
function observeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

