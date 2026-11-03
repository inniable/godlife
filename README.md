# GoalMate (가칭) - Z세대를 위한 일정 & 목표 수치 트래킹 앱

> **"미완성 과제의 인지 부하를 줄이고, 일상과 성취를 가볍게 기록·공유하는 노멀 크러시 라이프 트래커"**

---

## 🌟 주요 기능 (Key Features)

1. **3-Depth 이하 저인지 부하(Low Cognitive Load) UX**
   - 불필요한 설정 창을 배제하고 3단계 이내로 목표 등록 완료.
   - **인박스(보관함) 시스템**: 지금 당장 하지 않을 과제를 보관함에 파킹하여 **제이가르닉 효과(Zeigarnik Effect)** 및 **주의력 잔여물(Attention Residue)**을 최소화.
2. **목표 수치 트래킹 (3가지 모드 지원)**
   - **단순 체크(Binary)**: 미세 인터랙션 및 축하 애니메이션(Confetti) 제공.
   - **수치 목표(Numeric)**: 횟수, 분, 페이지 등 단계별 증감(`+1`, `+5`, `-1`) 버튼과 실시간 진행률 게이지.
   - **타이머 측정(Timer)**: 공부 및 운동을 위한 실시간 스톱워치 측정 및 리셋 지원.
3. **캘린더-투두 통합 뷰 & 비주얼 히트맵**
   - 날짜별 투두 달성률(0%~100%)에 따라 캘린더 셀 내부에 색상이 차오르는 시각적 피드백.
4. **기분 이모지 & 한줄 일기 스위칭 모드**
   - 탭 전환을 통해 오늘의 기분 이모지(🔥, ✨, 😊, 🍕, 💤, 🌧️) 및 한줄 일기 기록.
5. **인스타그램 스토리용 9:16 성취 공유 카드 생성기**
   - 원클릭으로 고화질 9:16 비율의 공유 카드 PNG 이미지 다운로드.
6. **세밀한 공개 범위 제어 (Privacy Level)**
   - 나만보기(Private), 친구공개(Friends), 전체공개(Public).

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Pretendard Font, Lucide React Icons, Canvas Confetti
- **State Management**: Zustand (클라이언트 상태 및 오프라인/로컬 캐시)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security)
- **Image Export**: html-to-image (9:16 인스타 스토리 캔버스 캡처)

---

## 🚀 빠른 시작 (Quick Start)

### 1. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

### 2. Supabase 데이터베이스 연결 (선택 사항)
1. [Supabase](https://supabase.com) 프로젝트 생성
2. `supabase/migrations/20261030_init_schema.sql` 파일의 SQL을 Supabase **SQL Editor**에 복사하여 실행
3. 루트 경로에 `.env.local` 파일을 생성하고 키를 입력:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
*(Supabase 키가 설정되지 않은 경우에도 데모 데이터와 로컬 상태를 통해 앱의 모든 기능을 즉시 체험할 수 있습니다.)*

---

## 📁 프로젝트 구조

```
antigravity/
├── supabase/
│   └── migrations/
│       └── 20261030_init_schema.sql    # Supabase DDL, RLS, 인덱스
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # 전역 메타데이터 및 레이아웃
│   │   ├── page.tsx                    # 메인 통합 화면
│   │   └── globals.css                 # 테마 및 애니메이션
│   ├── components/
│   │   ├── calendar/
│   │   │   └── CalendarView.tsx        # 캘린더 & 히트맵 게이지
│   │   ├── todos/
│   │   │   ├── TodoItem.tsx            # 체크, 수치, 스톱워치 타이머
│   │   │   ├── CreateTodoModal.tsx     # 저인지 부하 3-Depth 등록 모달
│   │   │   └── InboxDrawer.tsx         # 인박스 보관함 드로어
│   │   ├── diary/
│   │   │   └── DailyMoodLog.tsx        # 이모지 & 한줄 일기
│   │   └── share/
│   │       └── ShareCardModal.tsx      # 인스타 스토리 9:16 공유 카드
│   ├── lib/
│   │   ├── supabase.ts                 # Supabase 클라이언트
│   │   └── utils.ts                    # 유틸리티 함수
│   ├── store/
│   │   └── useGoalStore.ts             # Zustand 상태 관리
│   └── types/
│       └── database.ts                 # TypeScript 타입 정의
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```
