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
          <img src="/img/logo.png" alt="파트너정형외과">
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
  <div style="background:#3c5a44; overflow: hidden; font-family: 'Pretendard', sans-serif;">
    <div class="wrap" id="me" style="padding:5rem 0 4rem 0; margin: 0 auto; color:#fff; position: relative; max-width:1200px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6rem;">
        
        <!-- 좌측: 진료시간 -->
        <div style="width: 320px; flex-shrink: 0;">
          <h4 style="font-size: 3.2rem; font-weight: 800; margin-bottom: 2rem; border-bottom: 3px solid #fff; padding-bottom: 0.5rem; display: inline-block; letter-spacing:-1px;">진료시간</h4>
          <ul style="margin-bottom: 3rem; list-style:none; padding:0;">
            <li style="margin-bottom: 1.2rem; display:flex; justify-content:space-between; font-size:1.2rem; font-weight:500;">
              <span style="display:flex; align-items:center;"><i style="font-style:normal; margin-right:8px; font-size:0.8rem; vertical-align:middle;">●</i> 평 일</span>
              <span style="font-weight:700;">09:00~20:00</span>
            </li>
            <li style="margin-bottom: 1.2rem; display:flex; justify-content:space-between; font-size:1.2rem; font-weight:500;">
              <span style="display:flex; align-items:center;"><i style="font-style:normal; margin-right:8px; font-size:0.8rem; vertical-align:middle;">●</i> 토요일</span>
              <span style="font-weight:700;">09:00~14:00</span>
            </li>
            <li style="margin-bottom: 1.2rem; display:flex; justify-content:space-between; font-size:1.2rem; font-weight:500;">
              <span style="display:flex; align-items:center;"><i style="font-style:normal; margin-right:8px; font-size:0.8rem; vertical-align:middle;">●</i> 일요일·공휴일</span>
              <span style="font-weight:700;">09:00~14:00</span>
            </li>
            <li style="margin-bottom: 1.2rem; display:flex; justify-content:space-between; font-size:1.15rem; font-weight:500;">
              <span style="display:flex; align-items:center;"><i style="font-style:normal; margin-right:8px; font-size:0.8rem; vertical-align:middle;">●</i> 도수·물리치료실</span>
              <span style="font-weight:700;">평일 21:00까지</span>
            </li>
            <li style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:500;">
              <span style="display:flex; align-items:center;"><i style="font-style:normal; margin-right:8px; font-size:0.8rem; vertical-align:middle;">●</i> 점심시간</span>
              <span style="font-weight:700;">13:00~14:00</span>
            </li>
          </ul>
          
          <div style="margin-top:4rem;">
            <h5 style="font-size: 1.6rem; font-weight:800; color: #f1cc67; margin-bottom:1.5rem; letter-spacing:-0.5px;">365 정형외과전문의 진료</h5>
            <div style="display:flex; gap:8px;">
               <span style="background:#fff; color:#3c5a44; width:42px; height:42px; display:flex; align-items:center; justify-content:center; border-radius:10px; font-weight:900; font-size:1.6rem;">연</span>
               <span style="background:#fff; color:#3c5a44; width:42px; height:42px; display:flex; align-items:center; justify-content:center; border-radius:10px; font-weight:900; font-size:1.6rem;">중</span>
               <span style="background:#fff; color:#3c5a44; width:42px; height:42px; display:flex; align-items:center; justify-content:center; border-radius:10px; font-weight:900; font-size:1.6rem;">무</span>
               <span style="background:#fff; color:#3c5a44; width:42px; height:42px; display:flex; align-items:center; justify-content:center; border-radius:10px; font-weight:900; font-size:1.6rem;">휴</span>
            </div>
          </div>
        </div>

        <!-- 우측: 링크 카드 영역 -->
        <div style="flex-grow:1;">
          <div style="position:relative; height:80px; margin-bottom:20px; text-align:center;">
             <p style="position:absolute; top:10px; left:50%; transform:translateX(-50%); font-size:3.5rem; font-weight:900; opacity:0.1; letter-spacing:15px; width:100%; pointer-events:none; white-space:nowrap;">PARTNER ORTHOPEDICS</p>
             <p style="position:relative; z-index:1; font-size:1.5rem; font-weight:600; letter-spacing:10px; padding-top:25px;">P A R T N E R <span style="margin-left:5px;">O R T H O P E D I C S</span></p>
             <div style="width:100%; height:1px; background:rgba(255,255,255,0.2); margin-top:15px;"></div>
          </div>

          <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:15px;">
            ${[
      { t: '병원\n둘러보기', link: '1_3', bg: '/img/md_bg.jpg' },
      { t: '진료시간', link: '1_4', bg: '/img/sub_top_bg.jpg' },
      { t: '장비소개', link: '1_2', bg: '/img/mb_img.png' },
      { t: '온라인\n상담·예약', link: '6_2', bg: '/img/mc_img.png' },
      { t: '공지사항', link: '6_1', bg: '/img/sub_top_bg.jpg' }
    ].map((item) => `
              <div onclick="navigateTo('${item.link}')" class="me-card" style="position:relative; cursor:pointer; overflow:hidden; border-radius:15px; aspect-ratio:1/1.6; display:flex; align-items:center; justify-content:center; text-align:center; background:url('${item.bg}') center/cover no-repeat;">
                <div style="position:absolute; inset:0; background:rgba(0,0,0,0.5); z-index:1; transition:0.3s;" class="card-overlay"></div>
                <p style="position:relative; z-index:2; font-size:1.4rem; font-weight:800; line-height:1.4; color:#fff; white-space:pre-wrap; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${item.t}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <style>
        #me:before { display: none !important; }
        .me-card { transition: transform 0.3s; border: 1px solid rgba(255,255,255,0.1); }
        .me-card:hover { transform: translateY(-8px); border-color: rgba(255,255,255,0.4); }
        .me-card:hover .card-overlay { background: rgba(0,0,0,0.2); }
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
        <img src="/img/tail_logo.png" alt="logo" style="filter:brightness(0) invert(1);">
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
        <dd><a href="#page=6_2" onclick="navigateTo('6_2')"><img src="/img/mq_icon6.png" alt="진료예약"><p>진료예약</p></a></dd>
        <dd><a href="#page=1_4" onclick="navigateTo('1_4')"><img src="/img/mq_icon3.png" alt="진료시간"><p>진료시간</p></a></dd>
        <dd><a href="#page=1_5" onclick="navigateTo('1_5')"><img src="/img/mq_icon4.png" alt="오시는 길"><p>오시는 길</p></a></dd>
        <dd><a href="#page=1_3" onclick="navigateTo('1_3')"><img src="/img/mq_icon5.png" alt="둘러보기"><p>둘러보기</p></a></dd>
        <dd><a href="#" onclick="alert('블로그 페이지로 이동합니다.'); return false;"><img src="/img/mq_icon2.png" alt="블로그"><p>블로그</p></a></dd>
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
