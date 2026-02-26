# 파트너정형외과 홈페이지

대학병원 임상교수 출신 전문의가 직접 진료하는 프리미엄 정형외과 홈페이지입니다.

## 프로젝트 구조

```
├── server.js          ← Express 서버
├── db.js              ← SQLite 데이터베이스
├── routes/api.js      ← REST API (상담/공지/소식)
├── package.json
├── vercel.json        ← Vercel 배포 설정
├── public/            ← 정적 파일
│   ├── index.html
│   ├── css/style.css
│   ├── js/
│   │   ├── app.js       (SPA 라우팅)
│   │   ├── components.js (공통 UI)
│   │   └── pages.js     (페이지 메타데이터)
│   └── pages/           (31개 개별 HTML 페이지)
└── data/              ← SQLite DB 파일 (자동 생성)
```

## 실행 방법

### 1. Node.js 설치
https://nodejs.org 에서 LTS 버전 다운로드 → 설치

### 2. 의존성 설치
```bash
cd 연습
npm install
```

### 3. 서버 실행
```bash
npm start
```

브라우저에서 `http://localhost:3000` 접속

## API 목록

| Method | URL | 설명 |
|--------|-----|------|
| POST | /api/consultations | 온라인 상담 등록 |
| GET | /api/consultations | 상담 목록 조회 |
| GET | /api/notices | 공지사항 조회 |
| GET | /api/news | 소식 조회 |

## 배포

### Vercel 배포
```bash
npm i -g vercel
vercel
```

### Render 배포
1. GitHub에 코드 push
2. render.com에서 Web Service 생성
3. Build Command: `npm install`
4. Start Command: `npm start`
