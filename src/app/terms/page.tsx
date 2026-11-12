import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Scale, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        
        {/* Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-xl transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>홈으로 돌아가기</span>
        </Link>

        {/* Header */}
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
              GoalMate Official Terms
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            갓생살기(GoalMate) 서비스 이용약관
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            시행일자: 2026년 11월 12일 | 최종 갱신일: 2026년 11월 12일
          </p>
        </div>

        {/* Key Summary Alert */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-600">
            본 약관은 갓생살기(GoalMate) 애플리케이션(이하 &apos;앱&apos;)을 이용하는 모든 사용자와 개발팀 간의 권리, 의무 및 책임사항을 규정합니다. 앱을 설치하거나 이용함으로써 본 약관에 동의하는 것으로 간주됩니다.
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-7 text-xs sm:text-sm text-slate-600 leading-relaxed">
          
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-500" />
              제1조 (목적)
            </h2>
            <p>
              본 약관은 GoalMate Team(이하 &apos;운영자&apos;)이 제공하는 모바일 및 웹 기반 일정/목표 트래킹 서비스 &apos;갓생살기(GoalMate)&apos;의 이용 조건 및 절차, 이용자와 운영자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-500" />
              제2조 (서비스의 내용 및 특징)
            </h2>
            <p>
              운영자가 제공하는 서비스의 내용은 다음과 같습니다:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 pl-2">
              <li>하루 목표 수치 트래킹, 체크리스트 및 뽀모도로/스톱워치 타이머 기능</li>
              <li>감정 이모지 및 한 줄 다이어리(하루 회고) 기록 기능</li>
              <li>일정 달성 통계 및 인스타그램/카카오톡 공유 카드 이미지 생성 기능</li>
              <li>데이터 로컬 백업(JSON) 내보내기 및 복원 기능</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-violet-500" />
              제3조 (데이터의 보관 및 백업의 책임)
            </h2>
            <p>
              1. 본 서비스는 사용자의 편의와 프라이버시 보호를 위해 별도의 중앙 서버 가입 없이, 모든 데이터(목표, 기록, 타이머 등)를 <strong>이용자의 기기 내부(LocalStorage)</strong>에 로컬로 보관합니다.
            </p>
            <p className="mt-1">
              2. 사용자가 기기 변경, 기기 초기화, 캐시 삭제, 앱 삭제(제거)를 진행할 경우 기기 내 데이터가 삭제될 수 있으므로, 사용자는 앱 내 제공되는 [데이터 백업 파일 저장] 기능을 통해 주기적으로 데이터를 보관할 책임이 있습니다. 운영자는 이용자의 부주의로 인한 로컬 데이터 유실에 대해 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-500" />
              제4조 (광고의 게재)
            </h2>
            <p>
              1. 본 서비스는 모든 사용자에게 무료로 제공되며, 원활한 서비스 유지 및 개발을 위해 서비스 화면 내에 광고(Google AdMob 배너 광고 등)를 게재할 수 있습니다.
            </p>
            <p className="mt-1">
              2. 이용자가 서비스 내에 포함된 광고를 클릭하거나 외부 링크를 통해 제3자의 서비스를 이용하는 경우, 해당 제3자의 이용약관 및 개인정보처리방침의 적용을 받습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-violet-500" />
              제5조 (지식재산권 및 저작권)
            </h2>
            <p>
              1. 서비스 내 모든 UI 디자인, 앱 아이콘, 그래픽 및 프로그램에 대한 저작권 및 지식재산권은 운영자에게 귀속됩니다.
            </p>
            <p className="mt-1">
              2. 이용자가 앱을 사용하여 생성한 목표 내용, 일기 텍스트 및 공유 카드 이미지에 대한 권리는 해당 이용자에게 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-500" />
              제6조 (면책 조항)
            </h2>
            <p>
              1. 운영자는 천재지변, 기기 오류, 통신망 장애 등 불가항력적인 사유로 인하여 서비스를 일시적으로 제공할 수 없는 경우 이에 대한 책임을 지지 않습니다.
            </p>
            <p className="mt-1">
              2. 본 앱은 개인의 습관 형성 및 목표 달성을 돕는 도구이며, 특정 목표 달성 여부나 결과에 대해 법적 보증을 제공하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-500" />
              제7조 (문의처 및 분쟁 해결)
            </h2>
            <p>
              서비스 이용과 관련한 문의, 피드백 또는 불만사항은 아래의 창구를 통해 접수해 주시면 성실히 처리해 드립니다:
            </p>
            <div className="mt-2 p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/60 text-xs space-y-1">
              <p><strong>서비스명:</strong> 갓생살기 (GoalMate)</p>
              <p><strong>운영자:</strong> GoalMate Team (inniable)</p>
              <p><strong>GitHub 저장소:</strong> <a href="https://github.com/inniable/godlife" className="text-violet-600 underline" target="_blank" rel="noreferrer">https://github.com/inniable/godlife</a></p>
              <p><strong>문의 이메일:</strong> inniable@naver.com</p>
            </div>
          </section>

          <section className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            본 약관은 2026년 11월 12일부터 효력이 발생하며, 개정이 필요한 경우 서비스 공지 또는 GitHub 저장소를 통해 사전 고지합니다.
          </section>

        </div>
      </div>
    </div>
  );
}
