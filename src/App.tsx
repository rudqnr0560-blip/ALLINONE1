import React, { useState } from "react";
import { LandingData } from "./types";
import LandingPagePreview from "./components/LandingPagePreview";
import ReviewDashboard from "./components/ReviewDashboard";
import AiCopyGenerator from "./components/AiCopyGenerator";
import { Sparkles, BarChart2, MessageSquareCode, FileEdit, GraduationCap, Home, Lightbulb, Info } from "lucide-react";

const initialLandingData: LandingData = {
  heroTag: "부동산 전용 단독 제안",
  heroTitle: "모바일 요금 하나로,<br>사무소 인터넷 + 기가 와이파이가<br><span class=\"text-magenta-500 font-extrabold\">평생 '무료'</span>입니다.",
  heroSub: "매월 숨만 쉬어도 빠져나가는 사무실 통신비, 아직도 고정 지출로 내고 계신가요?\nLG U+ 올인원 패키지로 통신비 부담은 지우고, 계약 성사에만 집중하세요.",
  heroCtaText: "👉 우리 사무소 통신비 0원 만들기 (무료 컨설팅 신청)",
  heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  painTitle: "혹시 소장님도 <span class=\"text-magenta-500 font-extrabold\">이러고 계시지 않나요?</span>",
  painDesc: "임장 가랴, 매물 등록하랴, 고객 응대하랴 하루 24시간이 모자란 소장님.\n사무소 운영에 인터넷과 와이파이는 필수지만, 당연하다는 듯 매월 납부하는 통신비는 아깝지 않으셨나요?",
  pains: [
    { icon: "💸", text: "매월 3~5만 원씩 빠져나가는 아까운 고정 지출" },
    { icon: "🎁", text: "가입할 때 받은 3~40만 원 사은품, 계산해 보면 결국 내 돈 내고 쓰는 구조" },
    { icon: "🚨", text: "주말에 손님 몰렸는데 갑자기 끊긴 인터넷, 연락 안 되는 고객센터" }
  ],
  solutionTitle: "앞으로는 통신비, <span class=\"text-magenta-500 font-extrabold\">1원도 신경 쓰지 마세요.</span>",
  solutionDesc: "왜? LG U+ 올인원 패키지라면 '전액 무료'니까요!",
  solutionBoxText: "소장님이 쓰시는 모바일 요금 그대로, 부동산 사무소에 꼭 필요한 초고속 인터넷과 기가 와이파이를 무상으로 제공합니다. 통신사 이동이나 복잡한 결합 조건 없이, 오직 소장님들을 위해 설계된 가장 직관적인 비용 절감 솔루션입니다.",
  solutionImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  benefitTitle: "소장님은 오직 <span class=\"text-purple-600 font-extrabold\">'본업(계약)'</span>에만 집중하세요.",
  benefitDesc: "나머지는 LG U+가 책임집니다.",
  benefits: [
    {
      title: "✅ 혜택 1. 500M 초고속 인터넷 & 기가 Wi-Fi 요금 부담 ZERO",
      desc: "답답함 없는 500M 속도로 매물 등록과 고객 브리핑을 쾌적하게! 매월 청구서를 확인할 필요조차 없어집니다."
    },
    {
      title: "✅ 혜택 2. 진짜 경제적 이익 (3년간 약 120만 원 혜택)",
      desc: "신규 가입 시 주는 단발성 30~40만 원 상품권과 비교하지 마세요. 올인원 패키지는 3년 유지 시 약 120만 원 상당의 고정비 세이브 효과를 가져다줍니다."
    },
    {
      title: "✅ 혜택 3. 주말/공휴일 무휴! 사업장 전담 고객센터 운영",
      desc: "부동산은 주말이 대목이죠. 손님이 몰리는 주말과 공휴일에도 안심하세요. 문제 발생 시 사업장 전담 고객센터가 즉각적으로 해결해 드립니다."
    }
  ],
  reviewsTitle: "이미 많은 소장님들이<br><span class=\"text-purple-600 font-extrabold\">고정비 0원의 혜택</span>을 누리고 계십니다.",
  reviewsDesc: "실제 도입하신 대표님들의 생생한 한마디",
  reviews: [
    {
      quote: "🗣 \"3년이면 120만 원, 무시 못 할 돈이더라고요.\"",
      text: "\"처음엔 30만 원 상품권 준다는 곳에 혹했는데, 계산해 보니 매달 통신비를 안 내는 게 훨씬 이득이더군요. 포항 지역에서 부동산을 크게 운영하다 보니 PC도 많고 와이파이 쓸 일도 많은데, 500M 속도라 답답함도 없고 고정비도 0원이 되니 정말 만족합니다.\"",
      author: "- 포항 OO공인중개사사무소 김OO 대표님"
    },
    {
      quote: "🗣 \"주말에 인터넷이 끊겼는데, 바로 해결돼서 계약 살렸습니다.\"",
      text: "\"토요일 오후, 가계약금 입금 직전에 갑자기 인터넷이 먹통이 돼서 눈앞이 캄캄했습니다. 일반 고객센터는 휴일이라 연결도 안 되는데, U+ 전담 센터는 바로 응대해 주고 원격으로 처리해 줘서 무사히 도장 찍었습니다. 서비스 질이 다릅니다.\"",
      author: "- OO부동산중개법인 이OO 소장님"
    }
  ],
  ctaFormTitle: "복잡한 서류? 영업점 방문? <span class=\"text-magenta-500 font-extrabold\">필요 없습니다.</span>",
  ctaFormDesc: "전문 컨설턴트가 소장님 사무소로 직접 찾아갑니다.\n지금 바로 무료 방문 컨설팅을 신청하시고, 우리 부동산의 새는 통신비를 완벽하게 차단해 보세요.",
  ctaFormNote: "[한정 혜택] 이번 달 무료 방문 컨설팅을 신청하신 소장님들께는 통신비 진단 및 최적화 리포트를 무상으로 제공해 드립니다."
};

export default function App() {
  const [landingData, setLandingData] = useState<LandingData>(initialLandingData);
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [activeTab, setActiveTab] = useState<"review" | "ai">("review");
  const [showSavingsWidget, setShowSavingsWidget] = useState(false);
  const [savingsData, setSavingsData] = useState({
    monthlySavings: 37400,
    threeYearsSavings: 1346400,
    internetSpeed: "500M (기가 라이트)",
    mobileLines: 1,
  });

  const handleApplyAiCopy = (newHeadline: string, newSub: string) => {
    setLandingData((prev) => ({
      ...prev,
      heroTitle: newHeadline,
      heroSub: newSub,
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* 왼쪽: 컨트롤 & 분석 대시보드 (전체 45% 너비) */}
      <div className="w-full lg:w-[45%] h-[50vh] lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950 overflow-hidden shrink-0">
        {/* 상단 헤더 */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-magenta-600 flex items-center justify-center text-white shadow-md font-black text-sm">
              U+
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                LG U+ 부동산 랜딩 최적화 랩 <span className="text-[10px] bg-magenta-500/20 text-magenta-400 font-extrabold px-1.5 py-0.5 rounded-full border border-magenta-500/30">PRO</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-normal">부동산 소장님 타겟 Landing Page 분석 및 실험실</p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
            v1.2.0
          </div>
        </div>

        {/* 랩 메인 내비게이션 탭 */}
        <div className="flex bg-slate-900/50 p-2 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab("review")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "review" ? "bg-purple-600/10 text-purple-400 border border-purple-500/30 shadow-sm" : "text-slate-400 hover:text-slate-200 border border-transparent"}`}
          >
            <BarChart2 className="w-4 h-4" /> 검토 리포트 & 절감 시뮬레이션
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "ai" ? "bg-magenta-600/10 text-magenta-400 border border-magenta-500/30 shadow-sm" : "text-slate-400 hover:text-slate-200 border border-transparent"}`}
          >
            <Sparkles className="w-4 h-4 text-magenta-400 fill-magenta-400/20" /> AI 카피라이팅 제안 센터
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 overflow-hidden p-4 md:p-6 bg-slate-950/40">
          {activeTab === "review" ? (
            <ReviewDashboard
              savingsData={savingsData}
              setSavingsData={setSavingsData}
              showSavingsWidget={showSavingsWidget}
              setShowSavingsWidget={setShowSavingsWidget}
            />
          ) : (
            <AiCopyGenerator currentData={landingData} onApplyCopy={handleApplyAiCopy} />
          )}
        </div>

        {/* 하단 정보 바 */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-normal shrink-0">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" /> 랜딩페이지의 아무 텍스트나 클릭하여 직접 문구를 고쳐보세요.
          </span>
          <span className="hidden sm:inline font-mono">LAB STATUS: READY</span>
        </div>
      </div>

      {/* 오른쪽: 라이브 랜딩페이지 프리뷰 (전체 55% 너비) */}
      <div className="flex-1 h-[50vh] lg:h-full flex flex-col overflow-hidden bg-slate-900">
        <LandingPagePreview
          data={landingData}
          onChange={setLandingData}
          viewport={viewport}
          setViewport={setViewport}
          showSavingsWidget={showSavingsWidget}
          savingsData={savingsData}
        />
      </div>

    </div>
  );
}
