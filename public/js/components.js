// ============================================
// 파트너 정형외과 - 공통 컴포넌트
// ============================================

const MENU_DATA = [
  {
    name: '병원소개', key: '1', sub: [
      { name: '의료진소개', key: '1_1' },
      { name: '장비소개', key: '1_2' },
      { name: '둘러보기', key: '1_3' },
      { name: '진료시간', key: '1_4' },
      { name: '오시는길', key: '1_5' }
    ]
  },
  {
    name: '미세침습수술 클리닉', key: '2', sub: [
      { name: '골절', key: '2_1' },
      { name: '인대/힘줄파열', key: '2_2' },
      { name: '양성종양', key: '2_3' },
      { name: '방아쇠수지', key: '2_4' },
      { name: '터널증후군', key: '2_5' }
    ]
  },
  {
    name: '비수술클리닉', key: '3', sub: [
      { name: '특수영상정밀시술(씨암)', key: '3_1' },
      { name: '초음파유도정밀시술', key: '3_2' },
      { name: '신경차단술', key: '3_3' },
      { name: '신경성형술', key: '3_4' },
      { name: '관절가동술', key: '3_5' },
      { name: '관절조영술', key: '3_6' }
    ]
  },
  {
    name: '척추·관절클리닉', key: '4', sub: [
      { name: '척추클리닉', key: '4_1' },
      { name: '어깨클리닉', key: '4_2' },
      { name: '손/팔꿈치클리닉', key: '4_3' },
      { name: '무릎클리닉', key: '4_4' },
      { name: '족부클리닉', key: '4_5' },
      { name: '소아클리닉', key: '4_6' }
    ]
  },
  {
    name: '도수·물리치료클리닉', key: '5', sub: [
      { name: '보행/체형분석', key: '5_1' },
      { name: '도수교정 치료', key: '5_2' },
      { name: '운동재활치료', key: '5_3' },
      { name: '체외충격파치료', key: '5_4' },
      { name: '물리치료', key: '5_5' }
    ]
  },
  {
    name: '커뮤니티', key: '6', sub: [
      { name: '공지사항', key: '6_1' },
      { name: '파트너 소식', key: '6_4' },
      { name: '온라인상담/예약', key: '6_2' },
      { name: '비급여/증명서안내', key: '6_3' }
    ]
  }
];

function renderTopBar() {
  return `
  <div class="top-bar">
    <div class="container">
      <div class="top-bar-left">
        <span class="tel">📞 TEL. 02-430-1410</span>
        <span>서울 송파구 송파대로 141, 2층</span>
      </div>
      <div class="top-bar-right">
        <a href="/admin">로그인(관리자)</a>
        <a href="#" onclick="alert('회원가입은 준비 중입니다.'); return false;">JOIN</a>
      </div>
    </div>
  </div>`;
}

function renderHeader() {
  const menuHtml = MENU_DATA.map((m) => {
    const subHtml = m.sub.map(s =>
      `<li><a href="#page=${s.key}" onclick="navigateTo('${s.key}')">${s.name}</a></li>`
    ).join('');
    return `
    <li>
      <a href="#page=${m.sub[0].key}" onclick="navigateTo('${m.sub[0].key}')">${m.name}</a>
      <ul class="dropdown-menu">${subHtml}</ul>
    </li>`;
  }).join('');

  return `
  <div id="header">
    <div class="container header-inner">
      <div class="logo">
        <a href="#" onclick="navigateTo('home')">
          <img src="https://partneros.kr/img/logo.png" alt="파트너정형외과">
        </a>
      </div>
      
      <nav class="main-nav" id="mainNav">
        <ul>
          ${menuHtml}
        </ul>
      </nav>
      
      <div class="header-utils">
        <a href="/admin" class="util-link"><i class="iconfont icon-user"></i> LOGIN</a>
        <a href="#" class="util-link" onclick="alert('회원가입은 준비 중입니다.'); return false;">JOIN</a>
        <a href="tel:02-430-1410" class="util-link" style="color:var(--accent);"><i class="iconfont icon-call-center"></i> 02-430-1410</a>
      </div>
      
      <button class="mobile-toggle" id="mobileToggle" onclick="toggleMobileMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>`;
}

function renderFooter() {
  return `
  <div style="background:#405b45; overflow: hidden;">
  <div class="wrap" id="me" style="padding:4rem 0 0 0; margin: 0; color:#fff; position: relative;">
    <div class="dlw" style="display:flex; justify-content:space-between; align-items:flex-start; max-width:1200px; margin:0 auto; padding-bottom: 2rem; gap:2rem; position: relative; z-index: 10;">
      <!-- 좌측: 진료시간 -->
      <dt style="width: 30%; padding-right: 2rem; border-right: 1px solid rgba(255, 255, 255, 0.1);">
        <h4 style="font-size: 2.2rem; font-weight: 700; margin-bottom: 2rem; margin-top: 0; border-bottom: 2px solid #fff; padding-bottom: 0.8rem; display: inline-block;">진료시간</h4>
        <ul style="padding-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <li style="margin-bottom: 0.8rem; display:flex; justify-content:space-between; font-size:1.05rem;"><label style="opacity:0.9;">• 평 일</label><span style="font-weight:600;">09:00~20:00</span></li>
          <li style="margin-bottom: 0.8rem; display:flex; justify-content:space-between; font-size:1.05rem;"><label style="opacity:0.9;">• 토요일</label><span style="font-weight:600;">09:00~14:00</span></li>
          <li style="margin-bottom: 0.8rem; display:flex; justify-content:space-between; font-size:1.05rem;"><label style="opacity:0.9;">• 일요일·공휴일</label><span style="font-weight:600;">09:00~14:00</span></li>
          <li style="margin-bottom: 0.8rem; display:flex; justify-content:space-between; font-size:1.05rem;"><label style="opacity:0.9;">• 도수·물리치료실</label><span style="font-weight:600;">평일 21:00까지</span></li>
          <li style="display:flex; justify-content:space-between; font-size:1.05rem;"><label style="opacity:0.9;">• 점심시간</label><span style="font-weight:600;">13:00~14:00</span></li>
        </ul>
        <h5 style="font-size: 1.3rem; margin-top: 2rem; font-weight:700; color: #f1cc67;">365 정형외과전문의 진료</h5>
        <div style="margin-top:1rem; display:inline-flex; gap:6px;">
           <span style="background:#fff; color:#405b45; padding:6px 12px; border-radius:8px; font-weight:800; font-size:1.4rem;">연</span>
           <span style="background:#fff; color:#405b45; padding:6px 12px; border-radius:8px; font-weight:800; font-size:1.4rem;">중</span>
           <span style="background:#fff; color:#405b45; padding:6px 12px; border-radius:8px; font-weight:800; font-size:1.4rem;">무</span>
           <span style="background:#fff; color:#405b45; padding:6px 12px; border-radius:8px; font-weight:800; font-size:1.4rem;">휴</span>
        </div>
      </dt>
      <!-- 우측: 링크 카드 영역 -->
      <dd style="width: 65%;">
        <!-- 우측 상단 텍스트 (줄바꿈 방지를 위해 자간 축소, whitespace 설정) -->
        <h6 style="font-size: 1.05rem; letter-spacing: 8px; margin-bottom: 0.8rem; opacity: 0.9; font-weight:400; text-align:right; white-space:nowrap;">P A R T N E R <span style="margin-left:4px;">O R T H O P E D I C S</span></h6>
        <div style="border-bottom: 1px solid rgba(255,255,255,0.3); margin-bottom: 2.5rem;"></div>
        
        <!-- 5개 카드 그리드 -->
        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:12px;">
          ${[
      { t: '병원\n둘러보기', link: '1_3', svg: '<path d="M3 21v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/><path d="M10 9h4"/><path d="M12 7v4"/>' },
      { t: '진료시간', link: '1_4', svg: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>' },
      { t: '장비소개', link: '1_2', svg: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
      { t: '온라인\n상담·예약', link: '6_2', svg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="12" y1="7" x2="12" y2="13"/>' },
      { t: '공지사항', link: '6_1', svg: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>' }
    ].map((item) => `
            <div onclick="navigateTo('${item.link}')" class="me-card" style="position:relative; cursor:pointer; overflow:hidden; border-radius:12px; aspect-ratio:1/1.8; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; transition:0.3s;">
              <!-- 오버레이 효과 방지 및 투명테두리 -->
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; border:1px solid rgba(255,255,255,0.1); border-radius:12px; z-index:2; box-sizing:border-box;"></div>
              
              <!-- 아이콘 및 텍스트 -->
              <div style="position:relative; z-index:3; display:flex; flex-direction:column; align-items:center;">
                <div style="width:40px; height:40px; margin-bottom:15px; display:flex; align-items:center; justify-content:center;" class="me-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:100%; height:100%;">
                    ${item.svg}
                  </svg>
                </div>
                <p style="font-size:1.05rem; font-weight:700; line-height:1.3; color:#fff; white-space:pre-wrap;">${item.t}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </dd>
    </div>
    <style>
      #me:before { display: none !important; }
      .me-card { background: #2b3a2f; border: 1px solid rgba(255,255,255,0.05); }
      .me-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.3); background: #324436; }
      .me-card:hover .me-icon svg { stroke: #fff; transform: scale(1.1); filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); }
      .me-icon svg { transition: 0.3s; }
    </style>
  </div>
  </div>
  <footer id="footer" class="footer-area" style="margin-top: -1px; padding-top: 0;">
    <!-- 왼쪽 지도 영역 (구글 지도 - 파트너정형외과의원) -->
    <div id="map" class="footer-map" style="background:#2b2b2b;">
      <iframe src="https://maps.google.com/maps?width=100%25&amp;height=100%25&amp;hl=ko&amp;q=파트너정형외과의원+(파트너정형외과의원)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" 
        width="100%" height="100%" style="border:0; display: block;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    
    <!-- 오른쪽 정보 영역 -->
    <div class="footer-info">
      <div class="footer-logo">
        <img src="https://partneros.kr/img/tail_logo.png" alt="logo" style="filter:brightness(0) invert(1);">
        <p class="footer-eng-name">PARTNER ORTHOPEDICS</p>
      </div>
      
      <div class="tail_links">
        <a href="#">개인정보처리방침</a> <span class="divider">|</span>
        <a href="#">환자권리장전</a> <span class="divider">|</span>
        <a href="#page=6_3" onclick="navigateTo('6_3')">비급여수가</a>
      </div>
      
      <div class="footer-address-wrap">
        <p class="footer-address">서울특별시 송파구 송파대로 141, 2층 (문정동, 르피에드)</p>
        <p class="footer-copyright">
          대표자 : 김낙철, 지현준<br>
          사업자등록번호 : 441-94-01795 | Tel : 02-430-1410
        </p>
      </div>
    </div>
  </footer>`;
}

function renderPopup() {
  return `<div class="popup-overlay" id="popupOverlay"></div>`;
}

function renderFloatingBtns() {
  return `
    <div id="quickMenu2">
      <dl>
        <dd><a href="#page=6_2" onclick="navigateTo('6_2')"><img src="https://partneros.kr/img/mq_icon6.png" alt="진료예약"><p>진료예약</p></a></dd>
        <dd><a href="#page=1_4" onclick="navigateTo('1_4')"><img src="https://partneros.kr/img/mq_icon3.png" alt="진료시간"><p>진료시간</p></a></dd>
        <dd><a href="#page=1_5" onclick="navigateTo('1_5')"><img src="https://partneros.kr/img/mq_icon4.png" alt="오시는 길"><p>오시는 길</p></a></dd>
        <dd><a href="#page=1_3" onclick="navigateTo('1_3')"><img src="https://partneros.kr/img/mq_icon5.png" alt="둘러보기"><p>둘러보기</p></a></dd>
        <dd><a href="#" onclick="alert('블로그 페이지로 이동합니다.'); return false;"><img src="https://partneros.kr/img/mq_icon2.png" alt="블로그"><p>블로그</p></a></dd>
      </dl>
  </div>`;
}

function renderSubLayout(pageKey, title, parentName, content) {
  const parentKey = pageKey.split('_')[0];
  const menu = MENU_DATA.find(m => m.key === parentKey);
  const sideLinks = menu ? menu.sub.map(s =>
    `<li class="${s.key === pageKey ? 'active' : ''}"><a href="#page=${s.key}" onclick="navigateTo('${s.key}')">${s.name}</a></li>`
  ).join('') : '';

  return `
    <div class="sub-hero">
      <div class="sub-hero-content">
        <p class="sub-hero-subtitle">PARTNER ORTHOPEDICS<br>365일 정형외과 전문의 진료 척추 관절 건강 파트너</p>
        <h1>${parentName}</h1>
        <p class="sub-hero-desc">파트너 정형외과는 대학병원 수준의 진료와 장비시스템을 자랑합니다.<br>더불어 질 높은 의료서비스를 제공하기 위해 노력합니다.</p>
      </div>
      <div class="sub-tabs-wrapper">
        <ul class="sub-tabs">
          ${sideLinks}
        </ul>
      </div>
    </div>
    <div class="container sub-content-wrap">
      <main class="sub-content">
        ${content}
      </main>
    </div>`;
}
