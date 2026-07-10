import React, { useState } from "react";
import { AiSuggestion, LandingData } from "../types";
import { Sparkles, ArrowRight, RefreshCw, Layers, BrainCircuit, Check, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AiCopyGeneratorProps {
  currentData: LandingData;
  onApplyCopy: (newHeadline: string, newSub: string) => void;
}

export default function AiCopyGenerator({ currentData, onApplyCopy }: AiCopyGeneratorProps) {
  const [selectedTarget, setSelectedTarget] = useState("40-60대 고정비 절감에 예민한 부동산 소장님");
  const [selectedFocus, setSelectedFocus] = useState("일회성 사은품 30만원보다 매달 무료로 누리는 3개년 120만원 가치의 세이빙 효과 강조");
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<number | null>(null);

  const targets = [
    { label: "40-60대 알뜰 소장님 (고정비 민감)", value: "40대~60대 고정비 절감에 극도로 예민하고 복잡한 서류 절차를 혐오하는 공인중개사 소장님" },
    { label: "주말 대목 장애를 두려워하는 베테랑", value: "주말과 공휴일 대목에 인터넷 및 와이파이가 먹통이 되어 손님과 계약을 망칠까 봐 트라우마를 겪는 베테랑 공인중개사" },
    { label: "갓 개업한 초보 부동산 대표님", value: "부동산 공인중개사 자격증을 따고 이제 막 사무소를 개업하여 초기 인테리어 및 사무실 운영 고정비를 필사적으로 낮춰야 하는 신규 대표님" },
  ];

  const focuses = [
    { label: "상품권 사은품 vs 3년 세이빙 비교", value: "가입 시 일시불로 주는 30만 원 상품권보다 3년 동안 매달 무료로 아끼는 총 120만 원의 경제적 실익이 훨씬 크다는 팩트 강조" },
    { label: "주말 원격 24시간 철통 대응", value: "부동산의 생명은 주말! 주말 및 공휴일 무휴 사업장 전담 고객센터 운영으로 안심하고 도장 찍을 수 있다는 안정감 강조" },
    { label: "모바일 결합을 통한 실질적 0원 구현", value: "기존에 쓰던 모바일 폰 그대로 요금 변동 없이 결합만 하면 사무소 인터넷이 완벽하게 0원이 되는 극강의 편의성과 실용성 강조" },
  ];

  const generateCopySuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setAppliedId(null);

    try {
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: selectedTarget,
          focus: selectedFocus,
          currentHeadline: currentData.heroTitle,
          currentSub: currentData.heroSub,
        }),
      });

      if (!response.ok) {
        throw new Error("카피 추천 의견을 생성하는 중 서버 오류가 발생했습니다.");
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (id: number, headline: string, sub: string) => {
    onApplyCopy(headline, sub);
    setAppliedId(id);
    setTimeout(() => setAppliedId(null), 3000); // 3초 뒤 성공 알림 숨김
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col h-full">
      <div className="mb-6 shrink-0">
        <h3 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
          <BrainCircuit className="w-5 h-5 text-purple-600" /> AI 맞춤 카피라이터 센터
        </h3>
        <p className="text-xs text-slate-500 font-normal">
          Gemini 3.5-Flash 모델을 사용하여 부동산 소장님들의 타겟 유형과 소구 포인트를 매칭하는 고전환율 문구를 실시간 생성합니다.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* 설정 필드 */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">1. 저격할 타겟 소장님 페르소나</label>
            <div className="grid grid-cols-1 gap-2">
              {targets.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTarget(t.value)}
                  className={`text-left p-2.5 rounded-lg text-xs font-bold border transition-all ${selectedTarget === t.value ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">2. 핵심 자극 소구 포인트 (Focus)</label>
            <div className="grid grid-cols-1 gap-2">
              {focuses.map((f, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFocus(f.value)}
                  className={`text-left p-2.5 rounded-lg text-xs font-bold border transition-all ${selectedFocus === f.value ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateCopySuggestions}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> 생성 모델 분석 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" /> AI 고전환율 카피라이팅 추천받기
              </>
            )}
          </button>
        </div>

        {/* 에러 핸들링 */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* 추천 결과 렌더링 */}
        <div className="space-y-4">
          <AnimatePresence>
            {suggestions.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">추천된 AI 카피 디자인 대안 (3개)</h4>
                
                {suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-slate-200 hover:border-purple-300 rounded-xl p-4 bg-white shadow-sm hover:shadow transition-all duration-200 text-left relative overflow-hidden"
                  >
                    <span className="absolute top-0 right-0 bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                      안 {suggestion.id}
                    </span>

                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-magenta-500 bg-magenta-50 px-2 py-0.5 rounded">
                        {suggestion.concept}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block">헤드라인 (Headline)</span>
                        <p className="text-sm font-extrabold text-slate-900 leading-snug" dangerouslySetInnerHTML={{ __html: suggestion.headline }} />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block">서브타이틀 (Subtitle)</span>
                        <p className="text-xs text-slate-600 font-normal leading-relaxed">{suggestion.sub}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg text-[10px] text-slate-500 leading-relaxed mb-4 border border-slate-100 font-normal">
                      <strong className="text-purple-700">💡 타겟 자극 포인트:</strong> {suggestion.whyItWorks}
                    </div>

                    <button
                      onClick={() => handleApply(suggestion.id, suggestion.headline, suggestion.sub)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${appliedId === suggestion.id ? "bg-green-600 text-white shadow-sm" : "bg-purple-50 text-purple-700 hover:bg-purple-100"}`}
                    >
                      {appliedId === suggestion.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> 프리뷰에 성공적으로 적용됨!
                        </>
                      ) : (
                        <>
                          프리뷰에 즉시 적용하기 <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="py-12 text-center text-slate-300">
                  <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-xs font-semibold">설정을 고르고 카피를 생성해보세요.</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-normal">소장님 유형에 최적화된 결과가 나타납니다.</p>
                </div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
