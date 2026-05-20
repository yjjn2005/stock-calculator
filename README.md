# 주식 매수/매도 계산 도구 📈

실시간 주가 데이터를 연동한 웹/모바일 주식 매수/매도 계산 PWA 앱입니다.

**라이브 데모:** https://github.com/yjjn2005/stock-calculator

## 기능 ✨

- **📊 매수 계산기**: 투자 금액으로 매수 가능한 주수 자동 계산
- **💰 매도 계산기 (주수기준)**: 보유 주수로 손익/수익률 계산
- **💵 매도 계산기 (금액기준)**: 목표 금액에 필요한 주수 자동 계산
- **💼 포트폴리오 관리**: 보유 종목 현황 및 실시간 손익 모니터링
- **🔄 실시간 주가 조회**: Yahoo Finance API 연동 (자동 캐싱)
- **☁️ 클라우드 동기화**: Firebase Firestore로 데이터 실시간 동기화
- **📱 반응형 디자인**: PC/태블릿/모바일 모두 지원
- **⚡ PWA 지원**: 오프라인 모드, 앱 설치 지원

## 기술 스택 🛠️

### 프론트엔드
- **React 18** + TypeScript
- **Vite** (빌드 도구)
- **Tailwind CSS** (스타일링)
- **Zustand** (상태 관리)
- **React Router** (라우팅)
- **Axios** (HTTP 클라이언트)

### 백엔드
- **Firebase Firestore** (클라우드 데이터베이스)
- **Firebase Authentication** (익명 로그인)
- **Yahoo Finance API** (실시간 주가)

### 배포
- **GitHub Pages** (정적 호스팅)
- **GitHub Actions** (CI/CD 자동화)

## 설치

```bash
npm install
npm run dev
```

## 환경 설정

`.env.local` 파일 생성:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Firebase 프로젝트에서 위 값들을 얻을 수 있습니다:
1. [Firebase Console](https://console.firebase.google.com) 방문
2. 프로젝트 생성 (또는 기존 프로젝트 선택)
3. 프로젝트 설정 → 앱 추가 → 웹
4. Firebase 설정 정보 복사

## 배포

### GitHub Pages로 배포 (자동)

1. GitHub 레포지토리 생성 및 코드 푸시
2. GitHub Settings → Pages → Source를 `gh-pages` branch로 설정
3. `.github/workflows/deploy.yml`의 GitHub Secrets 설정:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. `main` branch에 push → 자동 빌드 & 배포

### 수동 빌드

```bash
npm run build
```

빌드 결과는 `dist` 폴더에 생성됩니다.

## 사용법

### 매수 계산기
1. 종목명 또는 티커 입력 (예: 삼성전자, AAPL)
2. 투자 금액 입력
3. 현재가 자동 조회 (또는 수동 입력)
4. 계산 결과 확인 → 저장

### 포트폴리오 관리
- 매수/매도 기록이 자동으로 저장됨
- 실시간 수익률 모니터링
- 오프라인 모드에서도 로컬 데이터 접근 가능

### PWA 설치
- **PC**: 주소창 우측 설치 버튼 클릭
- **iOS**: Safari → 공유 → 홈 화면에 추가
- **Android**: Chrome → 메뉴 → 앱 설치

## 라이센스

MIT
