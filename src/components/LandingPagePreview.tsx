import React, { useState } from "react";
import { LandingData } from "../types";
import { Smartphone, Monitor, Tablet, Edit2, CheckCircle, HelpCircle, Phone, Sparkles, Send, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingPagePreviewProps {
  data: LandingData;
  onChange: (newData: LandingData) => void;
  viewport: "mobile" | "tablet" | "desktop";
  setViewport: (v: "mobile" | "tablet" | "desktop") => void;
  showSavingsWidget: boolean;
  savingsData: {
    monthlySavings: number;
    threeYearsSavings: number;
    internetSpeed: string;
    mobileLines: number;
  };
}

export default function LandingPagePreview({
  data,
  onChange,
  viewport,
  setViewport,
  showSavingsWidget,
  savingsData,
}: LandingPagePreviewProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", area: "", agreement: false });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const startEdit = (fieldPath: string, currentValue: string) => {
    setEditingField(fieldPath);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingField) return;
    const keys = editingField.split(".");
    const newData = { ...data } as any;

    if (keys.length === 1) {
      newData[keys[0]] = editValue;
    } else if (keys.length === 3 && keys[0] === "pains") {
      const idx = parseInt(keys[1]);
      newData.pains[idx].text = editValue;
    } else if (keys.length === 3 && keys[0] === "benefits") {
      const idx = parseInt(keys[1]);
      if (keys[2] === "title") newData.benefits[idx].title = editValue;
      if (keys[2] === "desc") newData.benefits[idx].desc = editValue;
    } else if (keys.length === 3 && keys[0] === "reviews") {
      const idx = parseInt(keys[1]);
      if (keys[2] === "quote") newData.reviews[idx].quote = editValue;
      if (keys[2] === "text") newData.reviews[idx].text = editValue;
      if (keys[2] === "author") newData.reviews[idx].author = editValue;
    }

    onChange(newData);
    setEditingField(null);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone || !leadForm.area) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }
    if (!leadForm.agreement) {
      alert("개인정보 수집 및 이용동의에 체크해주세요.");
      return;
    }

    // Construct the SMS content
    const smsMessage = `[LG U+ 올인원 패키지 신청]\n부동산 상호명: ${leadForm.name}\n연락처: ${leadForm.phone}\n소재지: ${leadForm.area}`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsUrl = `sms:010-8080-0560${isIOS ? "&" : "?"}body=${encodeURIComponent(smsMessage)}`;

    // Try to open the sms link
    window.location.href = smsUrl;

    setLeadSubmitted(true);
  };

  // Editable Text Wrapper with Tooltip
  const EditableText = ({
    value,
    fieldPath,
    className = "",
    as: Component = "span" as any,
    isHtml = false,
  }: {
    value: string;
    fieldPath: string;
    className?: string;
    as?: any;
    isHtml?: boolean;
  }) => {
    const isEditing = editingField === fieldPath;

    if (isEditing) {
      return (
        <div className="inline-flex items-center gap-2 w-full max-w-lg my-1">
          {Component === "textarea" ? (
            <textarea
              className="border-2 border-magenta-500 rounded-lg p-2 text-gray-800 bg-white w-full text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={3}
            />
          ) : (
            <input
              type="text"
              className="border-2 border-magenta-500 rounded-lg p-2 text-gray-800 bg-white w-full text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          )}
          <button
            onClick={saveEdit}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-2 rounded-lg text-sm transition-colors shrink-0"
          >
            적용
          </button>
          <button
            onClick={() => setEditingField(null)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold px-3 py-2 rounded-lg text-sm transition-colors shrink-0"
          >
            취소
          </button>
        </div>
      );
    }

    const RenderTag = Component === "textarea" ? "span" : Component;

    return (
      <RenderTag
        onClick={() => startEdit(fieldPath, value)}
        className={`${className} group relative cursor-pointer hover:bg-magenta-50 hover:bg-opacity-50 transition-all rounded px-1 -mx-1 border-b border-dashed border-transparent hover:border-magenta-400`}
        title="클릭하여 즉시 문구 수정"
      >
        {isHtml ? (
          <span dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          value
        )}
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-900 text-white text-[10px] py-1 px-2 rounded shadow-md font-normal pointer-events-none transition-all duration-150 z-30 flex items-center gap-1 whitespace-nowrap">
          <Edit2 className="w-2.5 h-2.5 text-magenta-400" /> 클릭하여 실시간 문구 편집
        </span>
      </RenderTag>
    );
  };

  // Editable Image Wrapper with Tooltip
  const EditableImage = ({
    value,
    fieldPath,
    className = "",
  }: {
    value: string;
    fieldPath: string;
    className?: string;
  }) => {
    const isEditing = editingField === fieldPath;

    if (isEditing) {
      return (
        <div className="flex flex-col gap-2 p-3 bg-white border-2 border-magenta-500 rounded-xl my-2 max-w-lg mx-auto text-left relative z-20">
          <label className="text-xs font-bold text-slate-700">이미지 URL 주소</label>
          <input
            type="text"
            className="border border-slate-300 rounded-lg p-2 text-slate-800 bg-white w-full text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="이미지 URL을 입력하세요 (예: https://...)"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={saveEdit}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0"
            >
              적용
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0"
            >
              취소
            </button>
          </div>
        </div>
      );
    }

    return (
      <div 
        onClick={() => startEdit(fieldPath, value)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl shadow hover:shadow-md transition-all mx-auto"
        title="클릭하여 이미지 변경"
      >
        <img 
          src={value} 
          alt="Landing Section Visual" 
          referrerPolicy="no-referrer"
          className={className} 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 text-slate-900 font-bold text-xs py-2 px-3 rounded-xl shadow-md flex items-center gap-1">
            <Edit2 className="w-3.5 h-3.5 text-magenta-500" /> 클릭하여 이미지 변경
          </span>
        </div>
      </div>
    );
  };

  const viewportWidths = {
    mobile: "max-w-[390px] border-[8px] border-slate-800 rounded-[36px] min-h-[780px]",
    tablet: "max-w-[768px] border-[10px] border-slate-800 rounded-[24px] min-h-[900px]",
    desktop: "w-full border-none max-w-4xl rounded-none",
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      {/* 뷰포트 변경 상단바 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
          <span className="text-xs font-mono text-slate-500 ml-2">LIVE LANDING PREVIEW</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-md transition-colors ${viewport === "mobile" ? "bg-white text-purple-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            title="모바일 뷰"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded-md transition-colors ${viewport === "tablet" ? "bg-white text-purple-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            title="태블릿 뷰"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-md transition-colors ${viewport === "desktop" ? "bg-white text-purple-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            title="데스크톱 뷰"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 실시간 렌더링 영역 */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-start justify-center">
        <div className={`bg-white shadow-xl transition-all duration-300 overflow-hidden ${viewportWidths[viewport]}`}>
          {/* 모바일일 경우 노치 및 상단 스피커 홈 데코 */}
          {viewport === "mobile" && (
            <div className="w-full bg-slate-800 h-6 flex justify-center items-center relative shrink-0">
              <div className="w-32 h-4 bg-black rounded-b-2xl absolute top-0"></div>
              <div className="flex justify-between w-full px-5 text-[10px] text-slate-400 font-semibold select-none">
                <span>09:41</span>
                <div className="flex gap-1 items-center">
                  <span>5G</span>
                  <div className="w-3 h-2 bg-slate-400 rounded-sm"></div>
                </div>
              </div>
            </div>
          )}

          {/* 실제 랜딩페이지 콘텐츠 시작 */}
          <div className="font-sans text-slate-800 bg-white leading-relaxed antialiased">
            
            {/* 1. 히어로 섹션 */}
            <header className="bg-gradient-to-b from-purple-50 via-purple-50/50 to-white pt-12 pb-16 px-6 text-center border-b border-purple-100">
              <div className="max-w-2xl mx-auto">
                <div className="bg-purple-100/80 border border-purple-200 text-purple-800 text-xs md:text-sm font-semibold rounded-full px-4 py-2 mb-6 inline-flex items-center gap-1.5 shadow-sm">
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                  {data.heroTag}
                </div>
                
                {data.heroImage && (
                  <div className="mb-6 max-w-lg mx-auto">
                    <EditableImage 
                      value={data.heroImage} 
                      fieldPath="heroImage" 
                      className="w-full h-44 md:h-56 object-cover rounded-2xl border border-purple-100 shadow-sm"
                    />
                  </div>
                )}
                
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
                  <EditableText value={data.heroTitle} fieldPath="heroTitle" isHtml={true} />
                </h1>
                
                <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto mb-8 font-normal">
                  <EditableText value={data.heroSub} fieldPath="heroSub" as="textarea" />
                </p>


              </div>
            </header>

            {/* 2. 문제 제기 섹션 (Pain Points) */}
            <section className="py-16 px-6 bg-slate-50/60 border-b border-slate-100 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  <EditableText value={data.painTitle} fieldPath="painTitle" isHtml={true} />
                </h2>
                <p className="text-sm md:text-base text-slate-500 mb-10 max-w-xl mx-auto">
                  <EditableText value={data.painDesc} fieldPath="painDesc" as="textarea" />
                </p>

                <div className="space-y-4 max-w-lg mx-auto text-left">
                  {data.pains.map((pain, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-100 hover:border-magenta-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl p-4 flex items-start gap-4 border-l-4 border-l-magenta-500"
                    >
                      <span className="text-2xl shrink-0 leading-none">{pain.icon}</span>
                      <p className="text-slate-700 font-semibold text-sm md:text-base leading-snug">
                        <EditableText value={pain.text} fieldPath={`pains.${idx}.text`} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. 해결책 섹션 (U+ Solution) */}
            <section className="py-16 px-6 bg-slate-950 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-950/40 via-transparent to-transparent pointer-events-none"></div>
              <div className="max-w-2xl mx-auto relative z-10">
                <span className="text-magenta-400 font-extrabold text-xs md:text-sm tracking-widest uppercase mb-3 inline-block">THE LG U+ DIFFERENCE</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight leading-snug">
                  <EditableText value={data.solutionTitle} fieldPath="solutionTitle" isHtml={true} />
                </h2>
                <p className="text-sm md:text-base text-purple-200 mb-10 max-w-xl mx-auto">
                  <EditableText value={data.solutionDesc} fieldPath="solutionDesc" as="textarea" />
                </p>

                <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl text-left shadow-2xl relative">
                  <span className="absolute top-4 right-4 bg-purple-600/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-magenta-400 animate-spin" /> 부동산 단독 혜택
                  </span>
                  <p className="text-slate-200 text-sm md:text-base font-semibold leading-relaxed">
                    <EditableText value={data.solutionBoxText} fieldPath="solutionBoxText" as="textarea" />
                  </p>
                </div>
              </div>
            </section>

            {data.solutionImage && (
              <section className="py-8 bg-slate-50 border-y border-slate-100 flex justify-center px-6">
                <div className="max-w-2xl w-full">
                  <EditableImage 
                    value={data.solutionImage} 
                    fieldPath="solutionImage" 
                    className="w-full h-44 md:h-56 object-cover rounded-2xl border border-slate-200/60 shadow-sm"
                  />
                </div>
              </section>
            )}

            {/* 추천 장치: 실시간 절감 시뮬레이션 위젯 (랜딩페이지 중간 삽입) */}
            {showSavingsWidget && (
              <section className="py-12 px-6 bg-gradient-to-r from-purple-900 to-magenta-900 text-white text-center border-b border-purple-800">
                <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                  <div className="flex justify-center mb-3">
                    <span className="bg-yellow-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-bounce">
                      <Gift className="w-3.5 h-3.5" /> 실시간 절감 계산기 장치 탑재됨
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">
                    우리 부동산 맞춤형 요금 절감액
                  </h3>
                  <p className="text-xs text-purple-200 mb-4">
                    인터넷 ({savingsData.internetSpeed}) + 모바일 결합 ({savingsData.mobileLines}대 기준)
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-[11px] text-slate-300 block mb-1">매달 요금 혜택</span>
                      <span className="text-lg md:text-2xl font-black text-yellow-300">
                        {savingsData.monthlySavings.toLocaleString()}원
                      </span>
                    </div>
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-[11px] text-slate-300 block mb-1">3년 총 아끼는 돈</span>
                      <span className="text-lg md:text-2xl font-black text-magenta-300">
                        약 {savingsData.threeYearsSavings.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-3 text-left leading-normal">
                    * 위 계산은 실제 통신사 가입 조건을 기반으로 시뮬레이션한 수치이며, 가입하신 요금제에 따라 무료 적용 범위가 달라질 수 있습니다.
                  </p>
                </div>
              </section>
            )}

            {/* 4. 기대 효과 섹션 (Benefits) */}
            <section className="py-16 px-6 bg-white text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  <EditableText value={data.benefitTitle} fieldPath="benefitTitle" isHtml={true} />
                </h2>
                <p className="text-sm md:text-base text-slate-500 mb-12 max-w-xl mx-auto">
                  <EditableText value={data.benefitDesc} fieldPath="benefitDesc" as="textarea" />
                </p>

                <div className="space-y-6 text-left">
                  {data.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-100 hover:border-purple-200 transition-all duration-200 rounded-2xl p-6 md:p-8"
                    >
                      <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-600 shrink-0" />
                        <EditableText value={benefit.title} fieldPath={`benefits.${idx}.title`} />
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                        <EditableText value={benefit.desc} fieldPath={`benefits.${idx}.desc`} as="textarea" />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. 사회적 증명 섹션 (Reviews) */}
            <section className="py-16 px-6 bg-slate-50 text-center border-t border-slate-100">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  <EditableText value={data.reviewsTitle} fieldPath="reviewsTitle" isHtml={true} />
                </h2>
                <p className="text-sm md:text-base text-slate-500 mb-12">
                  <EditableText value={data.reviewsDesc} fieldPath="reviewsDesc" />
                </p>

                <div className="space-y-8 text-left max-w-xl mx-auto">
                  {data.reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-100/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <p className="text-purple-600 font-extrabold text-sm md:text-base mb-3">
                        <EditableText value={rev.quote} fieldPath={`reviews.${idx}.quote`} />
                      </p>
                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4">
                        <EditableText value={rev.text} fieldPath={`reviews.${idx}.text`} as="textarea" />
                      </p>
                      <p className="text-slate-400 text-right text-xs font-semibold">
                        <EditableText value={rev.author} fieldPath={`reviews.${idx}.author`} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 6. 최종 CTA 섹션 및 간이 신청 폼 */}
            <section id="cta-form" className="py-16 px-6 bg-gradient-to-b from-white to-purple-50 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  <EditableText value={data.ctaFormTitle} fieldPath="ctaFormTitle" isHtml={true} />
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mb-8 leading-relaxed">
                  <EditableText value={data.ctaFormDesc} fieldPath="ctaFormDesc" as="textarea" />
                </p>

                <div className="bg-white border border-purple-100 shadow-xl rounded-2xl p-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-600 to-magenta-600"></div>
                  
                  {leadSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-8 text-center"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">방문 컨설팅 신청이 완료되었습니다!</h3>
                      <p className="text-xs text-slate-500">
                        입력해주신 연락처로 전담 마케터가 영업일 기준 24시간 내에 연락드릴 예정입니다.
                      </p>
                      <button
                        onClick={() => {
                          setLeadSubmitted(false);
                          setLeadForm({ name: "", phone: "", area: "", agreement: false });
                        }}
                        className="mt-6 text-xs text-purple-600 hover:text-purple-700 font-bold underline"
                      >
                        새로 신청하기
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          부동산 상호명 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="부동산 상호명을 입력하세요"
                          className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-800"
                          value={leadForm.name}
                          onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          연락 가능한 전화번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="예: 010-1234-5678"
                          className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-800"
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          사무소 소재지 (지역명) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="예: 서울 강남구 역삼동, 포항 남구 등"
                          className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-800"
                          value={leadForm.area}
                          onChange={(e) => setLeadForm({ ...leadForm, area: e.target.value })}
                        />
                      </div>

                      <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                        <input
                          type="checkbox"
                          id="agree"
                          className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                          checked={leadForm.agreement}
                          onChange={(e) => setLeadForm({ ...leadForm, agreement: e.target.checked })}
                        />
                        <label htmlFor="agree" className="text-[10px] text-slate-500 leading-snug cursor-pointer">
                          <strong>[필수] 개인정보 수집 및 이용 동의</strong>: 무료 방문 컨설팅 및 요금 진단 서비스 조율 목적을 위해 상호명, 연락처, 지역 정보를 수집합니다.
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all mt-4"
                      >
                        <Send className="w-3.5 h-3.5" /> 1분 만에 무료 컨설팅 예약 신청하기
                      </button>
                    </form>
                  )}
                </div>

                <div className="mt-6 inline-flex bg-white border border-purple-200/80 rounded-xl p-4 text-left max-w-sm">
                  <div className="text-yellow-500 text-lg md:text-xl mr-3 shrink-0">⏳</div>
                  <p className="text-[10px] md:text-xs text-purple-950 font-semibold leading-relaxed">
                    <EditableText value={data.ctaFormNote} fieldPath="ctaFormNote" />
                  </p>
                </div>
              </div>
            </section>

          </div>
          {/* 랜딩페이지 콘텐츠 끝 */}
        </div>
      </div>
    </div>
  );
}
