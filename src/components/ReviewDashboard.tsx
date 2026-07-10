import React, { useState } from "react";
import { Persona } from "../types";
import { ShieldCheck, Eye, TrendingDown, ClipboardList, Target, AlertCircle, HelpCircle, FileText, CheckCircle2, DollarSign } from "lucide-react";
import { motion } from "motion/react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface ReviewDashboardProps {
  savingsData: {
    monthlySavings: number;
    threeYearsSavings: number;
    internetSpeed: string;
    mobileLines: number;
  };
  setSavingsData: React.Dispatch<React.SetStateAction<{
    monthlySavings: number;
    threeYearsSavings: number;
    internetSpeed: string;
    mobileLines: number;
  }>>;
  showSavingsWidget: boolean;
  setShowSavingsWidget: (v: boolean) => void;
}

export default function ReviewDashboard({
  savingsData,
  setSavingsData,
  showSavingsWidget,
  setShowSavingsWidget,
}: ReviewDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<"persona" | "critique" | "savings">("critique");

  // Persona Data
  const personas: Persona[] = [
    {
      name: "박용호 소장님 (58세)",
      ageGroup: "50대 후반, 베테랑 중개인",
      char: "인터넷 포털 매물 등록과 계약서 출력을 하루 종일 하지만, IT 기기 설정이나 통신 결합 할인은 머리 아파서 대리점에 다 맡김. 의심이 많고 꼼꼼함.",
      pains: [
        "사무실 고정 지출(임대료, 통신비 등)을 한 푼이라도 아끼고 싶음.",
        "토요일에 매물 보러 온 손님과 계약서 조율할 때 인터넷 끊기면 멘붕이 옴. 예전에 KT 끊겨서 속 타죽을 뻔함.",
      ],
      desires: [
        "복잡한 복합 할인이 아니라 그냥 한 번에 얼마 아끼는지 팩트만 알려주길 원함.",
        "인터넷 장애 시 주말에도 직원이 즉시 와서 해결해주기를 바람.",
      ],
      receptivity: "'평생 무료'라는 타이틀에 혹하지만, 세상에 공짜는 없다는 경험칙 때문에 '나중에 위약금이나 휴대폰 요금으로 엄청 받아내겠지?'라며 본능적으로 90% 의심함."
    },
    {
      name: "이지민 대표님 (41세)",
      ageGroup: "40대 초반, 트렌디한 젊은 소장",
      char: "네이버 블로그, 인스타그램 마케팅을 적극적으로 활용하며, 맥북과 기가 와이파이가 업무에 필수임. 가입 사은품 혜택과 요금 혜택을 꼼꼼하게 비교 분석함.",
      pains: [
        "인터넷 가입 시 주는 30만 원 사은품이 사실상 3년 약정 요금에 다 포함되어 있다는 걸 이미 인지함.",
        "인터넷 속도가 100M처럼 느려서 사진 업로드나 브리핑할 때 버벅이는 것을 매우 혐오함.",
      ],
      desires: [
        "진정한 가성비(사은품 30만원보다 매월 고정비 3~4만원이 안 나가는 게 장기적으로 이득)를 명확히 숫자로 검증하고 싶어함.",
      ],
      receptivity: "결합 조건이 구체적으로 U+ 어떤 요금제 이상이어야 하는지 명시되지 않아 랜딩페이지에 신뢰도가 떨어진다고 느낌."
    }
  ];

  // 계산기 요금 변경 핸들러
  const handleConfigChange = (speed: string, lines: number) => {
    // 가상의 절감액 산정 로직
    // 기본 인터넷 500M 요금 (월 33,000원 상당) + 기가 와이파이 (월 4,400원 상당) = 약 37,400원 기본 무료 혜택
    // 모바일 결합 회선 수가 늘어날 때마다 추가 할인 (대당 5,500원 추가)
    const baseSavings = 37400;
    const additionalSavings = lines * 5500;
    const monthly = baseSavings + additionalSavings;
    const threeYears = monthly * 36;

    setSavingsData({
      internetSpeed: speed,
      mobileLines: lines,
      monthlySavings: monthly,
      threeYearsSavings: threeYears,
    });
  };

  // 차트 데이터 구성
  const chartData = [
    { name: "타사 단발성 사은품", cost: 350000, color: "#94a3b8" },
    { name: "U+ 올인원 3년 절감액", cost: savingsData.threeYearsSavings, color: "#e6007e" },
  ];

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col h-full">
      {/* 탭 헤더 */}
      <div className="flex border-b border-slate-100 mb-6 shrink-0">
        <button
          onClick={() => setActiveSubTab("critique")}
          className={`flex-1 pb-3 text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${activeSubTab === "critique" ? "border-purple-600 text-purple-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <ClipboardList className="w-4 h-4" /> 4대 핵심 검토서
        </button>
        <button
          onClick={() => setActiveSubTab("persona")}
          className={`flex-1 pb-3 text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${activeSubTab === "persona" ? "border-purple-600 text-purple-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <Target className="w-4 h-4" /> 소장님 페르소나 분석
        </button>
        <button
          onClick={() => setActiveSubTab("savings")}
          className={`flex-1 pb-3 text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${activeSubTab === "savings" ? "border-purple-600 text-purple-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <DollarSign className="w-4 h-4" /> 통신비 절감 시뮬레이션
        </button>
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        {activeSubTab === "critique" && (
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 flex gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-extrabold text-purple-950 mb-1">고객 관점 총평</h4>
                <p className="text-[11px] text-purple-800 leading-relaxed font-normal">
                  현재 랜딩페이지는 부동산 소장님들의 가장 아픈 곳(매달 나가는 고정 지출, 인터넷 불통으로 인한 계약 파기 불안)을 매우 잘 짚어냈습니다. 그러나 과도하게 자극적인 '평생 무료' 키워드가 역설적으로 '과장 사기'라는 거부감을 줍니다. 신뢰성을 극대화하기 위한 안전장치와, 사은품 대비 실제 절감 효과를 숫자로 한눈에 체감하게 하는 보완책이 결합된다면 전환율이 비약적으로 향상될 것입니다.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* 1. 신뢰성 */}
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  신뢰성 (Credibility) 보완 제안
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-8 mb-3 font-normal">
                  <strong>지적 사항:</strong> "인터넷 + 기가 와이파이가 평생 무료"라는 혜택은 너무나 강력하지만, 40-60대 소장님들은 수많은 과장 영업 광고에 노출되어 있어 본능적인 불신을 갖습니다.
                </p>
                <div className="bg-white border border-slate-100 rounded-lg p-3 text-[11px] text-slate-700 leading-relaxed pl-8">
                  <span className="font-bold text-green-600 block mb-1">✅ 추천 해결책:</span>
                  - 헤드라인 근처나 푸터에 <strong>"LG U+ 공식 가입 대리점"</strong> 마크 또는 보증 문구를 삽입하세요.
                  - 결합의 상세 구조(예: 소장님이 U+ 모바일 특정 요금제 가입 시)를 <strong>"단서 조항"</strong> 또는 가벼운 툴팁 형태로 명확하고 솔직하게 표시하여 사기라는 오해를 원천 차단합니다.
                </div>
              </div>

              {/* 2. 정보 명확성 */}
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  정보의 명확성 (Clarity) 보완 제안
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-8 mb-3 font-normal">
                  <strong>지적 사항:</strong> "모바일 요금 하나로" 라고 되어 있으나 소장님이 기존에 어떤 통신사를 써야 하는지, 기기 변경이 필수인지 등의 세부 절차가 생략되어 혼란스럽습니다.
                </p>
                <div className="bg-white border border-slate-100 rounded-lg p-3 text-[11px] text-slate-700 leading-relaxed pl-8">
                  <span className="font-bold text-blue-600 block mb-1">✅ 추천 해결책:</span>
                  - 결합 절차를 3단계 일러스트형 텍스트로 축약하여 표시하세요 (예: 1. 쓰시던 폰 그대로 U+ 결합 신청 ➡️ 2. 사무소 초고속 인터넷 무상 설치 ➡️ 3. 매월 요금 평생 0원 청구서 수령).
                  - "약정이 남아있는 타사(SKT, KT) 고객도 해지 위약금 및 최적 요금제 맞춤 대안 설계를 해 드립니다" 라는 안심 멘트를 삽입하세요.
                </div>
              </div>

              {/* 3. 시각적 설득력 */}
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  시각적 설득력 (Visual Proof) 제안
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-8 mb-3 font-normal">
                  <strong>지적 사항:</strong> 텍스트가 가득하여 소장님들이 3초 이내에 핵심 가치를 느끼기 힘듭니다. '3년간 120만 원 이득'이라는 말이 글로만 적혀 있습니다.
                </p>
                <div className="bg-white border border-slate-100 rounded-lg p-3 text-[11px] text-slate-700 leading-relaxed pl-8">
                  <span className="font-bold text-rose-600 block mb-1">✅ 추천 해결책:</span>
                  - 타사에서 신규 가입 시 일시불로 주는 사은품(약 30~40만 원 상당) 대비, <strong>3년간 고정비를 계속 안 내는 올인원 패키지 요금 절감 혜택(최소 120만 원 이상)</strong>의 월등한 경제적 차이를 보여주는 비교 막대 그래프를 랜딩페이지에 탑재해야 합니다.
                  - (💡 오른쪽 '통신비 절감 시뮬레이션' 탭을 통해 라이브 계산기를 프리뷰에 활성화해 보세요!)
                </div>
              </div>

              {/* 4. 행동 촉구 */}
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  행동 촉구 (CTA) 개선 제안
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-8 mb-3 font-normal">
                  <strong>지적 사항:</strong> 최종 버튼이 외부 '구글 설문지(forms.google.com)' 링크로 이탈시킵니다. 이는 소장님들에게 복잡한 느낌을 주며 이탈률을 배가시킵니다.
                </p>
                <div className="bg-white border border-slate-100 rounded-lg p-3 text-[11px] text-slate-700 leading-relaxed pl-8">
                  <span className="font-bold text-purple-600 block mb-1">✅ 추천 해결책:</span>
                  - 외부 구글 폼으로 나가지 않게 하고, 랜딩페이지 맨 밑에 <strong>"1분 간이 방문신청 폼"</strong>을 깔끔한 입력창 형태로 내장하는 것이 전환율을 평균 40% 이상 끌어올릴 수 있습니다.
                  - (💡 현재 라이브 프리뷰 하단에 저희가 이미 간이 신청 폼을 수려하게 구현 및 탑재해 놓았습니다!)
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 페르소나 분석 탭 */}
        {activeSubTab === "persona" && (
          <div className="space-y-6">
            <p className="text-xs text-slate-500 font-normal">
              랜딩페이지의 타겟 오디언스인 두 대표적인 공인중개사 소장님들의 페르소나입니다. 이들의 심리를 역지사지로 분석하면 최적의 카피라이팅이 나옵니다.
            </p>
            {personas.map((per, idx) => (
              <div key={idx} className="border border-slate-100 rounded-2xl p-5 bg-gradient-to-br from-slate-50 to-white shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-900">{per.name}</h4>
                  <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{per.ageGroup}</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">👤 한 줄 성향:</span>
                    <p className="text-slate-700 font-normal leading-relaxed">{per.char}</p>
                  </div>
                  <div>
                    <span className="font-bold text-red-500 block mb-0.5">🚨 핵심 페인 포인트:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-700 font-normal leading-relaxed">
                      {per.pains.map((p, pIdx) => <li key={pIdx}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-green-600 block mb-0.5">🎯 니즈 및 기대 가치:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-700 font-normal leading-relaxed">
                      {per.desires.map((d, dIdx) => <li key={dIdx}>{d}</li>)}
                    </ul>
                  </div>
                  <div className="bg-purple-50/50 p-2.5 rounded-lg border border-purple-100/40">
                    <span className="font-bold text-purple-800 block mb-0.5 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> U+ 무료 제안에 대한 의구심 및 반응:
                    </span>
                    <p className="text-purple-950 font-normal leading-relaxed italic">"{per.receptivity}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 요금 절감 계산기 시뮬레이터 탭 */}
        {activeSubTab === "savings" && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <h4 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-magenta-500" /> 통신비 절감 설정
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between">
                    <span>사무실 설치 희망 인터넷 속도</span>
                    <span className="text-purple-600 font-extrabold">{savingsData.internetSpeed}</span>
                  </label>
                  <div className="flex gap-2">
                    {["100M (기본)", "500M (기가 라이트)", "1G (초고속 기가)"].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleConfigChange(speed, savingsData.mobileLines)}
                        className={`flex-1 py-2 text-center text-xs font-bold rounded-lg border transition-all ${savingsData.internetSpeed === speed ? "bg-purple-600 border-purple-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        {speed.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between">
                    <span>결합 가능한 대표자/가족 모바일 회선 수</span>
                    <span className="text-purple-600 font-extrabold">{savingsData.mobileLines} 대</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    value={savingsData.mobileLines}
                    onChange={(e) => handleConfigChange(savingsData.internetSpeed, parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1 mt-1">
                    <span>0대 (모바일 무결합)</span>
                    <span>1대</span>
                    <span>2대</span>
                    <span>3대</span>
                    <span>4대</span>
                    <span>5대 (최대)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 시각화 차트 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-500 mb-3 text-center">사은품 상품권 지급 vs 3년 올인원 요금 세이빙 비교</h4>
              
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600, fill: "#64748b" }} />
                    <YAxis tickFormatter={(val) => `${(val / 10000).toLocaleString()}만원`} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Tooltip formatter={(value) => [`${Number(value).toLocaleString()}원`, "총 가치"]} />
                    <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">고객 체감 총 절감 가치 차이</span>
                  <p className="text-xs font-bold text-slate-800 leading-normal">
                    올인원 패키지 가입 시 약 <span className="text-magenta-500 font-extrabold">{(savingsData.threeYearsSavings - 350000).toLocaleString()}원 더 이득!</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 프리뷰에 위젯 탑재 컨트롤 */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-purple-950 block">프리뷰에 절감 계산기 위젯 얹기</span>
                <p className="text-[10px] text-purple-800 font-normal">랜딩페이지 중간에 실시간 절감 위젯을 활성화합니다.</p>
              </div>
              <button
                onClick={() => setShowSavingsWidget(!showSavingsWidget)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${showSavingsWidget ? "bg-magenta-600 text-white hover:bg-magenta-700" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {showSavingsWidget ? "활성화됨" : "비활성화됨"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
