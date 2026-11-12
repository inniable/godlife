import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
              GoalMate Official Policy
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            갓생살기(GoalMate) 개인정보처리방침
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            시행일자: 2026년 11월 12일 | 최종 수정일자: 2026년 11월 12일
          </p>
        </div>

        {/* Key Summary Alert */}
        <div className="mb-8 p-4 rounded-2xl bg-violet-50/70 border border-violet-100 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-700">
            <strong className="text-violet-900 block font-bold mb-0.5">안심하고 사용하세요!</strong>
            갓생살기(GoalMate)는 사용자의 개인정보와 작성된 모든 목표, 일기 데이터를 <strong>외부 서버로 전송하지 않고 오직 사용자의 기기(로컬 저장소)에만 안전하게 보관</strong>합니다.
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-500" />
              1. 수집하는 개인정보 항목 및 수집 방법
            </h2>
            <p>
              &apos;갓생살기(GoalMate)&apos;(이하 &apos;앱&apos;)는 별도의 회원가입 없이 바로 사용 가능한 애플리케이션으로, 회원가입을 위한 이메일, 이름, 전화번호 등의 개인식별정보를 직접 수집하거나 서버에 저장하지 않습니다.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 pl-2">
              <li><strong>사용자 생성 데이터:</strong> 목표명, 수행 시간, 목표 수치, 카테고리, 감정 이모지 및 한 줄 일기 (모두 사용자 기기 내부 LocalStorage에만 저장)</li>
              <li><strong>서비스 이용 중 자동 수집되는 정보:</strong> 앱 내 배너 광고 제공(Google AdMob) 및 서비스 품질 개선을 위한 광고 식별자(ADID/IDFA), 기기 모델명, OS 버전 등의 비식별 기기 정보</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-500" />
              2. 개인정보의 이용 목적
            </h2>
            <p>
              수집된 데이터는 오직 다음의 목적을 위해서만 이용됩니다:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 pl-2">
              <li>개인 목표 및 습관의 진척도 측정, 타이머 측정, 완료 여부 계산</li>
              <li>사용자가 요청하는 인스타그램/카카오톡 공유 카드 이미지 생성</li>
              <li>Google AdMob을 통한 모바일 맞춤형/비맞춤형 광고 송출</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-500" />
              3. 개인정보의 보유 및 파기 절차
            </h2>
            <p>
              앱에서 작성된 모든 목표와 데이터는 사용자의 휴대폰/브라우저 내부에만 존재합니다.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 pl-2">
              <li><strong>파기 방법:</strong> 사용자가 앱 내부에서 [삭제] 버튼을 누르거나, 앱을 스마트폰에서 삭제(제거)할 경우 즉시 영구 파기됩니다.</li>
              <li>앱 데이터 백업(JSON) 기능 사용 시 생성되는 백업 파일 또한 사용자가 직접 소유하며, 외부로 전송되지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-500" />
              4. 제3자 제공 및 외부 라이브러리 정책
            </h2>
            <p>
              앱은 원칙적으로 사용자의 데이터를 제3자에게 판매하거나 제공하지 않습니다. 다만, 무료 서비스 운영을 위해 다음의 글로벌 광고 네트워크 솔루션을 활용합니다:
            </p>
            <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
              <p className="font-bold text-slate-800">Google AdMob (구글 애드몹)</p>
              <p className="text-slate-500 mt-1">제공 목적: 인앱 광고 서비스 제공 및 광고 성과 측정</p>
              <p className="text-slate-500">수집 항목: 광고 식별자, 쿠키 및 비식별 사용 통계</p>
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noreferrer" 
                className="text-violet-600 underline font-semibold mt-1 inline-block"
              >
                Google 개인정보처리방침 확인하기 ↗
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-500" />
              5. 만 14세 미만 아동의 개인정보 보호
            </h2>
            <p>
              앱은 만 14세 미만 아동의 개인정보를 수집하지 않으며, 어린이를 주 타겟으로 한 콘텐츠를 제작하지 않습니다. 만약 만 14세 미만 아동의 정보가 수집된 사실을 인지할 경우 즉시 해당 데이터를 파기 조치합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-500" />
              6. 개인정보 보호책임자 및 문의처
            </h2>
            <p>
              앱 이용 중 발생하는 개인정보 보호 관련 문의 및 건의사항은 아래의 개발자 연락처로 문의해 주시기 바랍니다.
            </p>
            <div className="mt-2 p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/60 text-xs space-y-1">
              <p><strong>서비스명:</strong> 갓생살기 (GoalMate)</p>
              <p><strong>개발자 / 운영자:</strong> GoalMate Team (inniable)</p>
              <p><strong>GitHub 저장소:</strong> <a href="https://github.com/inniable/godlife" className="text-violet-600 underline" target="_blank" rel="noreferrer">https://github.com/inniable/godlife</a></p>
              <p><strong>문의 이메일:</strong> inniable@naver.com (또는 GitHub Issues)</p>
            </div>
          </section>

          <section className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            본 방침은 2026년 11월 12일부터 시행되며, 관련 법령 또는 서비스 변경에 따라 내용이 추가, 삭제 및 수정될 경우 앱 공지 또는 GitHub 저장소를 통해 공지합니다.
          </section>

        </div>
      </div>
    </div>
  );
}
