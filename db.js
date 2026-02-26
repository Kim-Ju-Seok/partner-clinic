const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');
const LOCK_PATH = DB_PATH + '.lock';

// 기본 데이터
const DEFAULT_DATA = {
  admin: {
    username: 'admin',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' // admin1234 (bcrypt)
  },
  consultations: [],
  notices: [
    { id: 1, title: '파트너정형외과 개원 안내', content: '안녕하세요. 파트너정형외과의원이 서울 송파구 송파대로 141, 2층에 개원하였습니다.\n\n대학병원 임상교수 출신 정형외과 전문의 3인이 365일 연중무휴로 진료합니다.\n척추·관절 통증으로 고생하시는 분들께 정확한 진단과 맞춤 치료를 제공하겠습니다.\n\n많은 관심 부탁드립니다.', views: 1024, created_at: '2024-08-01' },
    { id: 2, title: '주차 안내 - 건물 지하주차장 2시간 무료', content: '파트너정형외과의원 방문 시 건물 지하주차장을 이용하실 수 있습니다.\n\n- 주차요금: 2시간 무료 (병원 방문 시)\n- 주차장 위치: 건물 지하 1~2층\n- 안내데스크에서 주차 도장을 받아주세요.\n\n대중교통 이용 시: 지하철 8호선 문정역 3번 출구 도보 5분', views: 567, created_at: '2024-09-01' },
    { id: 3, title: '체외충격파 치료 장비 도입 안내', content: '파트너정형외과에서 최신 체외충격파 치료 장비를 도입하였습니다.\n\n체외충격파 치료란?\n- 비수술적 방법으로 통증 부위에 충격파를 가하여 치료하는 방법\n- 석회화건염, 족저근막염, 테니스엘보 등에 효과적\n- 시술 시간 약 10~15분\n\n예약 문의: 02-430-1410', views: 324, created_at: '2024-10-15' },
    { id: 4, title: '12월 원장님 진료 스케줄 안내', content: '2024년 12월 원장님별 진료 스케줄을 안내드립니다.\n\n- 김병훈 원장: 월·화·수·금 / 토(격주)\n- 이승현 원장: 월·화·목·금 / 일(격주)\n- 박정민 원장: 화·수·목·금 / 토(격주)\n\n정확한 일정은 전화(02-430-1410)로 확인 부탁드립니다.', views: 289, created_at: '2024-11-28' },
    { id: 5, title: '2025년 설 연휴 진료 안내', content: '2025년 설 연휴 진료 안내드립니다.\n\n- 1월 28일(화) 설날 당일: 휴진\n- 1월 27일(월), 29일(수): 09:00 ~ 14:00 단축 진료\n- 그 외 평일: 정상 진료\n\n응급 환자는 전화 상담 가능합니다.\n문의: 02-430-1410', views: 152, created_at: '2025-01-20' }
  ],
  news: [
    { id: 1, title: '파트너정형외과와 함께하는 건강 캠페인', content: '파트너정형외과에서 지역 주민을 위한 건강 캠페인을 진행합니다.\n\n- 무료 척추·관절 건강 상담\n- 보행 분석 체험\n- 올바른 자세 교정 안내\n\n많은 참여 부탁드립니다.', views: 234, created_at: '2024-09-20' },
    { id: 2, title: '파트너정형외과 3D 보행분석 시스템 도입', content: '파트너정형외과에서 최첨단 3D 보행분석 시스템을 도입하였습니다.\n\n정밀한 보행 패턴 분석을 통해 체형 불균형, 보행 이상을 진단하고\n맞춤형 재활 프로그램을 제공합니다.\n\n문의: 02-430-1410', views: 187, created_at: '2024-11-05' },
    { id: 3, title: '김병훈 원장, 대한정형외과학회 학술대회 발표', content: '김병훈 원장이 대한정형외과학회 학술대회에서\n"미세침습수술의 최신 동향과 임상 결과"를 주제로 발표하였습니다.\n\n파트너정형외과는 학술 활동을 통해\n최신 의학 지식을 환자 치료에 적용하고 있습니다.', views: 98, created_at: '2025-01-10' }
  ],
  popups: [
    {
      id: 1,
      title: '진료일정 안내',
      content: '<h4>🩺 원장님별 진료 일정</h4><table><tr><td>김병훈 원장</td><td>월·화·수·금 / 토(격주)</td></tr><tr><td>이승현 원장</td><td>월·화·목·금 / 일(격주)</td></tr><tr><td>박정민 원장</td><td>화·수·목·금 / 토(격주)</td></tr></table><h4>⏰ 진료시간 안내</h4><table><tr><td>평일</td><td>09:00 ~ 20:00</td></tr><tr><td>토·일·공휴일</td><td>09:00 ~ 14:00</td></tr><tr><td>점심시간</td><td>13:00 ~ 14:00</td></tr></table>',
      active: true,
      start_date: '2025-01-01',
      end_date: '2030-12-31',
      created_at: '2025-01-01'
    }
  ],
  _idCounters: { notices: 5, news: 3, consultations: 0, popups: 1 }
};

// data 폴더 생성
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// 간단한 파일 잠금 (동시 쓰기 방지)
function acquireLock(timeout = 3000) {
  const start = Date.now();
  while (fs.existsSync(LOCK_PATH)) {
    if (Date.now() - start > timeout) {
      // 잠금이 오래되면 강제 해제 (비정상 종료 대비)
      try { fs.unlinkSync(LOCK_PATH); } catch (e) { }
      break;
    }
    // 10ms 대기
    const waitUntil = Date.now() + 10;
    while (Date.now() < waitUntil) { }
  }
  try {
    fs.writeFileSync(LOCK_PATH, String(process.pid), { flag: 'wx' });
    return true;
  } catch (e) {
    return false;
  }
}

function releaseLock() {
  try { fs.unlinkSync(LOCK_PATH); } catch (e) { }
}

// DB 로드 (없으면 기본 데이터로 생성)
function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      // 마이그레이션: 기존 DB에 없는 필드 보충
      if (!data.popups) data.popups = DEFAULT_DATA.popups;
      if (!data.admin) data.admin = DEFAULT_DATA.admin;
      if (!data._idCounters) {
        data._idCounters = {
          notices: data.notices.length > 0 ? Math.max(...data.notices.map(n => n.id)) : 0,
          news: data.news.length > 0 ? Math.max(...data.news.map(n => n.id)) : 0,
          consultations: data.consultations.length > 0 ? Math.max(...data.consultations.map(c => c.id)) : 0,
          popups: (data.popups || []).length > 0 ? Math.max(...data.popups.map(p => p.id)) : 0
        };
      }
      return data;
    }
  } catch (e) {
    console.error('[DB] 파일 로드 실패:', e.message);
  }
  saveDB(DEFAULT_DATA);
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveDB(data) {
  acquireLock();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('[DB] 파일 저장 실패:', e.message);
  } finally {
    releaseLock();
  }
}

// 고유 ID 생성 (카운터 기반, 중복 방지)
function nextId(data, type) {
  if (!data._idCounters) data._idCounters = {};
  if (!data._idCounters[type]) data._idCounters[type] = 0;
  data._idCounters[type]++;
  return data._idCounters[type];
}

// 내보내기
module.exports = { loadDB, saveDB, nextId };
