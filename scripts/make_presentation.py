import os
import pptx
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path):
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color definitions
    C_DARK = RGBColor(15, 23, 42)        # #0F172A (Deep Slate)
    C_CARD_BG = RGBColor(248, 250, 252)  # #F8FAFC (Card Light)
    C_CARD_BORDER = RGBColor(226, 232, 240) # #E2E8F0
    C_WHITE = RGBColor(255, 255, 255)
    C_VIOLET = RGBColor(139, 92, 246)    # #8B5CF6 (Brand Accent)
    C_VIOLET_DARK = RGBColor(109, 40, 217) # #6D28D9
    C_EMERALD = RGBColor(16, 185, 129)   # #10B981 (Success/Store)
    C_SKY = RGBColor(14, 165, 233)       # #0EA5E9 (Cloud)
    C_AMBER = RGBColor(245, 158, 11)     # #F59E0B (Warning)
    C_ROSE = RGBColor(244, 63, 94)       # #F43F5E
    C_TEXT_DARK = RGBColor(30, 41, 59)   # #1E293B
    C_TEXT_MUTED = RGBColor(100, 116, 139) # #64748B

    def add_header(slide, title, category="DEPLOYMENT GUIDE"):
        # Header category badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(2.2), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = RGBColor(238, 242, 255)
        badge.line.color.rgb = C_VIOLET
        badge.line.width = Pt(1)
        tf = badge.text_frame
        tf.text = category
        tf.paragraphs[0].font.size = Pt(10)
        tf.paragraphs[0].font.bold = True
        tf.paragraphs[0].font.color.rgb = C_VIOLET_DARK
        tf.paragraphs[0].alignment = PP_ALIGN.CENTER

        # Main slide title
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(11.7), Inches(0.7))
        p = tb.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_DARK

    # =========================================================================
    # SLIDE 1: Cover Slide
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_DARK
    bg1.line.fill.background()

    # Decorative accent card
    decor = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.2), Inches(3.8), Inches(5.1))
    decor.fill.solid()
    decor.fill.fore_color.rgb = RGBColor(30, 41, 59)
    decor.line.color.rgb = C_VIOLET
    decor.line.width = Pt(2)
    dtf = decor.text_frame
    dtf.vertical_anchor = MSO_ANCHOR.MIDDLE
    dp1 = dtf.paragraphs[0]
    dp1.text = "GoalMate ✨"
    dp1.font.size = Pt(22)
    dp1.font.bold = True
    dp1.font.color.rgb = C_VIOLET
    dp1.alignment = PP_ALIGN.CENTER
    
    dp2 = dtf.add_paragraph()
    dp2.text = "\n[Full-Stack App]\nNext.js 14 + Capacitor\nSupabase + Cloud Run\n\n[Google Ecosystem]\nGoogle Play Store 출시\nGoogle Cloud Run 배포"
    dp2.font.size = Pt(13)
    dp2.font.color.rgb = RGBColor(203, 213, 225)
    dp2.alignment = PP_ALIGN.CENTER

    # Main Cover Text
    badge1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.6), Inches(3.2), Inches(0.4))
    badge1.fill.solid()
    badge1.fill.fore_color.rgb = RGBColor(139, 92, 246, )
    badge1.fill.fore_color.rgb = C_VIOLET_DARK
    badge1.line.fill.background()
    b1_tf = badge1.text_frame
    b1_tf.text = "GOOGLE DEPLOYMENT MASTERPLAN"
    b1_tf.paragraphs[0].font.size = Pt(11)
    b1_tf.paragraphs[0].font.bold = True
    b1_tf.paragraphs[0].font.color.rgb = C_WHITE
    b1_tf.paragraphs[0].alignment = PP_ALIGN.CENTER

    tb1 = s1.shapes.add_textbox(Inches(0.95), Inches(2.2), Inches(7.5), Inches(3.2))
    p = tb1.text_frame.paragraphs[0]
    p.text = "GoalMate 구글 배포\n업무 순서 및 가이드"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p2 = tb1.text_frame.add_paragraph()
    p2.text = "\n플레이스토어 모바일 앱(AAB) 출시부터\n구글 클라우드(Cloud Run) 서버리스 웹 배포까지의 완벽 로드맵"
    p2.font.size = Pt(16)
    p2.font.color.rgb = RGBColor(148, 163, 184)

    p3 = tb1.text_frame.add_paragraph()
    p3.text = "\n버전: v1.0.0 | 작성일: 2026년 10월 | 대상: 개발 및 런칭 담당팀"
    p3.font.size = Pt(12)
    p3.font.color.rgb = C_EMERALD

    # =========================================================================
    # SLIDE 2: Executive Summary (Two-Track Architecture)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "구글 배포 투트랙(Two-Track) 전략 개요", "EXECUTIVE SUMMARY")

    # Track A Card
    card_a = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8))
    card_a.fill.solid()
    card_a.fill.fore_color.rgb = C_CARD_BG
    card_a.line.color.rgb = C_EMERALD
    card_a.line.width = Pt(2)
    
    tf_a = card_a.text_frame
    p = tf_a.paragraphs[0]
    p.text = "[트랙 A] 구글 플레이스토어 모바일 앱 출시"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    p_a = tf_a.add_paragraph()
    p_a.text = "\n• 목적: 안드로이드 스마트폰 사용자가 스토어에서 직접 다운로드\n• 기술 스택: Capacitor 6.0 + Android Studio + AAB Bundle\n• 주요 특징:\n  - 오프라인 단독 구동 가능한 정적 번들링 (out/)\n  - 플레이스토어 검색 및 노출로 Z세대 신규 유저 유입 극대화\n  - 스마트폰 제스처, 뒤로가기 버튼, 스플래시 화면 완벽 지원\n• 필수 요건: 구글 개발자 등록($25), 20인 테스터 14일 비공개 테스트\n• 예상 소요 기간: 약 3주 ~ 4주"
    p_a.font.size = Pt(13)
    p_a.font.color.rgb = C_TEXT_DARK

    # Track B Card
    card_b = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8))
    card_b.fill.solid()
    card_b.fill.fore_color.rgb = C_CARD_BG
    card_b.line.color.rgb = C_SKY
    card_b.line.width = Pt(2)

    tf_b = card_b.text_frame
    p = tf_b.paragraphs[0]
    p.text = "[트랙 B] 구글 클라우드(Cloud Run) 웹 호스팅"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_SKY

    p_b = tf_b.add_paragraph()
    p_b.text = "\n• 목적: 인터넷 전 세계 어디서든 LTE/5G 웹 브라우저로 24시간 접속\n• 기술 스택: Docker + Google Cloud Run (Serverless Container)\n• 주요 특징:\n  - 트래픽 0일 때 서버 비용 $0 (트래픽에 따라 0~5개 자동 스케일링)\n  - 서울 리전(asia-northeast3) 배포로 초고속 응답 속도\n  - 관리형 HTTPS SSL 인증서 자동 발급 및 맞춤 도메인 매핑\n• 필수 요건: Google Cloud 계정 및 gcloud CLI\n• 배포 실행 시간: 스크립트 실행 후 약 3분 소요"
    p_b.font.size = Pt(13)
    p_b.font.color.rgb = C_TEXT_DARK

    # =========================================================================
    # SLIDE 3: Track A - 7 Steps Roadmap
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "[트랙 A] 구글 플레이스토어 출시 7단계 업무 순서", "TRACK A : GOOGLE PLAY STORE")

    steps = [
        ("Step 1", "웹 배포 & 도메인", "정식 HTTPS 도메인 확보\nPWA 매니페스트 확인", C_VIOLET),
        ("Step 2", "안드로이드 패키징", "Capacitor 플랫폼 생성\n앱 ID: com.goalmate.app", C_VIOLET),
        ("Step 3", "개발자 계정 등록", "Google Play Console 가입\n$25 결제 & 신원 인증", C_VIOLET_DARK),
        ("Step 4", "서명 키 & AAB 빌드", "release.keystore 생성\n스토어 제출용 AAB 추출", C_SKY),
        ("Step 5", "스토어 등록정보 작성", "스크린샷(최소 2장), 아이콘\n개인정보처리방침 URL", C_SKY),
        ("Step 6", "20인 비공개 테스트", "★ 개인 계정 필수 규정\n20명 테스터가 14일 유지", C_AMBER),
        ("Step 7", "프로덕션 최종 심사", "구글 검토팀 심사 (3~7일)\n플레이스토어 공식 런칭!", C_EMERALD),
    ]

    x_start = Inches(0.8)
    card_w = Inches(1.58)
    gap = Inches(0.12)

    for i, (st, title, desc, col) in enumerate(steps):
        x = x_start + i * (card_w + gap)
        box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.0), card_w, Inches(4.5))
        box.fill.solid()
        box.fill.fore_color.rgb = C_WHITE
        box.line.color.rgb = col
        box.line.width = Pt(1.5)

        # Header of card
        head = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.08), Inches(2.1), card_w - Inches(0.16), Inches(0.5))
        head.fill.solid()
        head.fill.fore_color.rgb = col
        head.line.fill.background()
        head.text_frame.text = st
        head.text_frame.paragraphs[0].font.size = Pt(11)
        head.text_frame.paragraphs[0].font.bold = True
        head.text_frame.paragraphs[0].font.color.rgb = C_WHITE
        head.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

        # Content
        c_tb = s3.shapes.add_textbox(x + Inches(0.05), Inches(2.8), card_w - Inches(0.1), Inches(3.5))
        cp1 = c_tb.text_frame.paragraphs[0]
        cp1.text = title
        cp1.font.size = Pt(13)
        cp1.font.bold = True
        cp1.font.color.rgb = C_TEXT_DARK
        cp1.alignment = PP_ALIGN.CENTER

        cp2 = c_tb.text_frame.add_paragraph()
        cp2.text = f"\n{desc}"
        cp2.font.size = Pt(11)
        cp2.font.color.rgb = C_TEXT_MUTED
        cp2.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 4: Track A - Critical Checkpoints & Guidelines
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "구글 플레이 심사 핵심 통과 전략 & 체크리스트", "CRITICAL CHECKPOINTS")

    # Box 1: 20 Testers Rule
    b1 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8))
    b1.fill.solid()
    b1.fill.fore_color.rgb = RGBColor(254, 243, 199) # Amber light
    b1.line.color.rgb = C_AMBER
    b1.line.width = Pt(2)
    tf1 = b1.text_frame
    p1 = tf1.paragraphs[0]
    p1.text = "⚠️ [필수 규정] 20인 14일 비공개 테스트 대응"
    p1.font.size = Pt(16)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(180, 83, 9)

    p1_sub = tf1.add_paragraph()
    p1_sub.text = "\n2023년 11월 이후 생성된 개인 개발자 계정은 필수 적용:\n\n1. 테스터 모집:\n   - 친구, 지인, 개발 커뮤니티(오픈채팅/디스코드) 20인 확보\n   - Google Group 또는 이메일 목록으로 테스터 등록\n\n2. 14일 연속성 유지:\n   - 20명이 앱 설치 후 최소 14일간 앱을 삭제하지 않아야 함\n   - 정기적인 피드백(버그 제보 등) 작성 유도 권장\n\n3. 14일 경과 후:\n   - Play Console에서 '프로덕션 신청' 버튼 활성화\n   - 수집된 피드백 및 테스트 질문지 답변 작성 후 심사 요청"
    p1_sub.font.size = Pt(12)
    p1_sub.font.color.rgb = C_TEXT_DARK

    # Box 2: Store Assets Checklist
    b2 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8))
    b2.fill.solid()
    b2.fill.fore_color.rgb = C_CARD_BG
    b2.line.color.rgb = C_CARD_BORDER
    b2.line.width = Pt(1.5)
    tf2 = b2.text_frame
    p2 = tf2.paragraphs[0]
    p2.text = "📋 스토어 등록 준비 서류 & 에셋 규격"
    p2.font.size = Pt(16)
    p2.font.bold = True
    p2.font.color.rgb = C_VIOLET_DARK

    p2_sub = tf2.add_paragraph()
    p2_sub.text = "\n1. 그래픽 에셋:\n   - 앱 아이콘: 512 x 512 px (32비트 PNG, 투명도 없음)\n   - 그래픽 이미지(피처드 그래픽): 1024 x 500 px (JPG/PNG)\n   - 모바일 스크린샷: 최소 2장 이상 (9:16 비율 권장, 1080x1920)\n\n2. 법적 및 정책 필수 항목:\n   - 개인정보처리방침(Privacy Policy) 공개 웹 링크 필수\n   - 앱 접근 권한 안내 (인터넷 권한, 스토리지 권한 등)\n   - 타겟 연령층: 만 13세 이상 (Z세대 청소년/대학생)\n\n3. 보안 서명 키 (Keystore):\n   - goalmate-release-key.jks 파일과 비밀번호는 클라우드 영구 보관\n   - 분실 시 기존 앱 업데이트 불가 (신규 앱으로 다시 출시해야 함)"
    p2_sub.font.size = Pt(12)
    p2_sub.font.color.rgb = C_TEXT_DARK

    # =========================================================================
    # SLIDE 5: Track B - Google Cloud Run Architecture
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "[트랙 B] 구글 클라우드(Cloud Run) 배포 아키텍처", "TRACK B : GOOGLE CLOUD RUN")

    # Diagram row (3 cards)
    g_cards = [
        ("1. 도커 컨테이너화", "Dockerfile", "• Next.js 14 Standalone 빌드\n• Node.js 20 Alpine 초경량 이미지\n• 불필요한 파일 배제(.dockerignore)\n• 8080 포트 기본 바인딩", C_SKY),
        ("2. Cloud Build & Registry", "Artifact Registry", "• gcloud builds submit 명령어로\n  구글 클라우드 서버에서 직접 빌드\n• 안전한 비공개 컨테이너 저장소 저장\n• 로컬 도커 설치 불필요", C_VIOLET),
        ("3. Cloud Run 서버리스", "Serverless Serving", "• 서울 리전(asia-northeast3) 배포\n• 트래픽 0일 때 인스턴스 0 (비용 $0)\n• 트래픽 폭증 시 5개까지 자동 증설\n• 글로벌 CDN & HTTPS 자동 적용", C_EMERALD),
    ]

    for i, (title, sub, body, col) in enumerate(g_cards):
        gx = Inches(0.8) + i * Inches(3.95)
        g_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, gx, Inches(1.8), Inches(3.8), Inches(3.5))
        g_box.fill.solid()
        g_box.fill.fore_color.rgb = C_WHITE
        g_box.line.color.rgb = col
        g_box.line.width = Pt(1.5)

        gtf = g_box.text_frame
        gp1 = gtf.paragraphs[0]
        gp1.text = title
        gp1.font.size = Pt(15)
        gp1.font.bold = True
        gp1.font.color.rgb = col

        gp2 = gtf.add_paragraph()
        gp2.text = f"[{sub}]\n"
        gp2.font.size = Pt(11)
        gp2.font.bold = True
        gp2.font.color.rgb = C_TEXT_MUTED

        gp3 = gtf.add_paragraph()
        gp3.text = body
        gp3.font.size = Pt(12)
        gp3.font.color.rgb = C_TEXT_DARK

    # Bottom summary box for Cloud Run script
    b_bot = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.3))
    b_bot.fill.solid()
    b_bot.fill.fore_color.rgb = C_DARK
    b_bot.line.fill.background()
    b_tf = b_bot.text_frame
    bp = b_tf.paragraphs[0]
    bp.text = "⚡ 원클릭 배포 실행 명령어 (PowerShell)"
    bp.font.size = Pt(13)
    bp.font.bold = True
    bp.font.color.rgb = C_SKY

    bp2 = b_tf.add_paragraph()
    bp2.text = "powershell scripts/deploy-cloud-run.ps1 -ProjectId \"당신의-GCP-프로젝트ID\"\n→ API 활성화, 컨테이너 빌드, 서울 리전 배포까지 약 3분 만에 전 자동 완료됩니다."
    bp2.font.size = Pt(12)
    bp2.font.color.rgb = C_WHITE

    # =========================================================================
    # SLIDE 6: Cheat Sheet & CLI Commands
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "실무 명령어 및 프로젝트 생성 파일 퀵 레퍼런스", "COMMAND & FILE CHEAT SHEET")

    # Table or grid
    sh1 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.9))
    sh1.fill.solid()
    sh1.fill.fore_color.rgb = C_CARD_BG
    sh1.line.color.rgb = C_CARD_BORDER
    sh1.line.width = Pt(1)
    stf1 = sh1.text_frame
    sp1 = stf1.paragraphs[0]
    sp1.text = "📱 모바일 앱(Capacitor) 실무 명령어"
    sp1.font.size = Pt(16)
    sp1.font.bold = True
    sp1.font.color.rgb = C_EMERALD

    sp1_b = stf1.add_paragraph()
    sp1_b.text = "\n1. 웹 코드 빌드 및 안드로이드 동기화:\n   npm run cap:sync\n   (Next.js 정적 빌드 out/ 생성 후 안드로이드 폴더로 복사)\n\n2. Android Studio 즉시 실행:\n   npm run cap:open\n   (안드로이드 스튜디오에서 프로젝트 열기)\n\n3. 릴리즈 서명 키 생성:\n   powershell scripts/generate-keystore.ps1\n\n4. 생성된 프로젝트 위치:\n   • android/ (Android Studio 프로젝트)\n   • capacitor.config.ts (앱 아이디/서버 설정)"
    sp1_b.font.size = Pt(12)
    sp1_b.font.color.rgb = C_TEXT_DARK

    sh2 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.9))
    sh2.fill.solid()
    sh2.fill.fore_color.rgb = C_CARD_BG
    sh2.line.color.rgb = C_CARD_BORDER
    sh2.line.width = Pt(1)
    stf2 = sh2.text_frame
    sp2 = stf2.paragraphs[0]
    sp2.text = "☁️ 구글 클라우드(Cloud Run) 실무 명령어"
    sp2.font.size = Pt(16)
    sp2.font.bold = True
    sp2.font.color.rgb = C_SKY

    sp2_b = stf2.add_paragraph()
    sp2_b.text = "\n1. 구글 클라우드 로그인 및 프로젝트 선택:\n   gcloud auth login\n   gcloud config set project [PROJECT_ID]\n\n2. 원클릭 클라우드 배포 실행:\n   powershell scripts/deploy-cloud-run.ps1\n\n3. 서비스 상태 및 배포 URL 확인:\n   gcloud run services describe goalmate --region asia-northeast3\n\n4. 생성된 클라우드 파일:\n   • Dockerfile (Next.js 14 멀티스테이지 컨테이너)\n   • .dockerignore (빌드 제외 목록)\n   • scripts/deploy-cloud-run.ps1 (자동 배포 스크립트)"
    sp2_b.font.size = Pt(12)
    sp2_b.font.color.rgb = C_TEXT_DARK

    # =========================================================================
    # SLIDE 7: Summary & Immediate Next Steps
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "성공적인 런칭을 위한 추천 다음 단계", "NEXT ACTION PLAN")

    n_cards = [
        ("Step 1", "Android Studio 설치 & AAB 빌드", "무료 Android Studio 설치 후 'npm run cap:open'을 실행하여 모바일 에뮬레이터나 실기기에서 첫 테스트를 진행합니다.", C_VIOLET),
        ("Step 2", "Google Play Console 가입 ($25)", "구글 개발자 등록($25 1회 결제) 및 신원 인증을 완료하고 앱 생성(com.goalmate.app)을 준비합니다.", C_EMERALD),
        ("Step 3", "20인 비공개 테스터 사전 확보", "개발자 계정 등록과 동시에 14일간 앱을 설치하고 사용해 줄 지인 20명의 이메일을 미리 리스트업합니다.", C_AMBER),
        ("Step 4", "구글 클라우드 웹 런칭", "deploy-cloud-run.ps1을 실행하여 24시간 가동되는 공식 웹사이트 URL을 확보하고 플레이스토어 심사 링크에 제출합니다.", C_SKY),
    ]

    for i, (st, title, desc, col) in enumerate(n_cards):
        y = Inches(1.8) + i * Inches(1.25)
        bar = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(1.1))
        bar.fill.solid()
        bar.fill.fore_color.rgb = C_WHITE
        bar.line.color.rgb = col
        bar.line.width = Pt(1.5)

        # Step tag
        pill = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), y + Inches(0.18), Inches(1.1), Inches(0.35))
        pill.fill.solid()
        pill.fill.fore_color.rgb = col
        pill.line.fill.background()
        pill.text_frame.text = st
        pill.text_frame.paragraphs[0].font.size = Pt(11)
        pill.text_frame.paragraphs[0].font.bold = True
        pill.text_frame.paragraphs[0].font.color.rgb = C_WHITE
        pill.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

        # Text
        btb = s7.shapes.add_textbox(Inches(2.3), y + Inches(0.08), Inches(10.0), Inches(0.9))
        bp1 = btb.text_frame.paragraphs[0]
        bp1.text = title
        bp1.font.size = Pt(14)
        bp1.font.bold = True
        bp1.font.color.rgb = C_TEXT_DARK

        bp2 = btb.text_frame.add_paragraph()
        bp2.text = desc
        bp2.font.size = Pt(11.5)
        bp2.font.color.rgb = C_TEXT_MUTED

    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    out_dir = r"C:\Users\82108\Desktop\antigravity"
    file_path = os.path.join(out_dir, "GoalMate_구글_배포_업무순서_가이드.pptx")
    create_deck(file_path)
