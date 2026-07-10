import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client lazy-style
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing");
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // API Endpoint: AI Copywriting generation
  app.post("/api/generate-copy", async (req, res) => {
    try {
      const { target, focus, currentHeadline, currentSub } = req.body;
      const client = getGeminiClient();

      const prompt = `
        당신은 부동산 중개사무소(공인중개사 소장님들)를 타겟으로 하는 B2B 영업 마케팅 전문가이자 전환율이 극대화된 카피라이터입니다.
        현재 LG U+ 올인원 패키지(모바일 요금 그대로 유지하면 사무소 인터넷 + 기가 와이파이가 평생 무료)의 랜딩페이지 카피를 개선하려고 합니다.

        [기존 헤드라인]: "${currentHeadline || "모바일 요금 하나로, 사무소 인터넷 + 기가 와이파이가 평생 '무료'입니다."}"
        [기존 서브타이틀]: "${currentSub || "매월 숨만 쉬어도 빠져나가는 사무실 통신비, 아직도 고정 지출로 내고 계신가요?"}"
        
        [타겟 고객 정보]:
        - 대상 페르소나: ${target || "40대~60대 부동산 공인중개사 소장님"}
        - 소장님들이 겪는 핵심 페인 포인트: ${focus || "매달 고정비 지출이 아깝고, 주말이나 공휴일에 손님 몰릴 때 인터넷 끊기면 계약이 파기될까 봐 극도로 불안함. 복잡한 서류나 영업점 방문은 딱 질색함."}

        위 타겟과 페인 포인트를 정확히 저격하여, 전환율(무료 컨설팅 신청율)을 극대화할 수 있는 새로운 헤드라인(메인 타이틀)과 서브타이틀의 대안 세트 3개를 추천해 주세요.
        
        카피라이팅 작성 지침:
        1. 부동산 업계의 은어, 걱정거리, 상황(예: 계약서 도장 찍기 직전, 임장, 주말 대목, 공인중개사법 등)을 자연스럽게 녹여내어 높은 몰입감을 주세요.
        2. "무료"라는 말만 듣고 "사기 아니야?"라고 의심하는 소장님들의 마음을 달래기 위해, 'LG U+ 공식 혜택', '눈속임 없는 진짜 세이빙' 같은 신뢰 요소를 문장에 은밀하게 결합해 주세요.
        3. 40-60대 타겟이므로 직관적이고 쉬운 단어를 사용하세요. 너무 세련되거나 현학적인 영어 표현은 피하세요.

        출력은 반드시 다음과 같은 형태의 JSON 배열 구조여야 합니다. JSON 외의 다른 텍스트는 출력하지 마세요.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "A list of 3 copy suggestions",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER, description: "1, 2, 3 일련번호" },
                concept: { type: Type.STRING, description: "이 카피가 의도한 소구 포인트나 컨셉트 설명" },
                headline: { type: Type.STRING, description: "강렬한 메인 헤드라인 (줄바꿈이 필요한 경우 <br> 태그 삽입)" },
                sub: { type: Type.STRING, description: "헤드라인을 보완하는 매력적인 본문 서브타이틀" },
                whyItWorks: { type: Type.STRING, description: "이 카피가 부동산 소장님들의 심리를 어떻게 자극하는지에 대한 마케팅 관점 설명" },
              },
              required: ["id", "concept", "headline", "sub", "whyItWorks"],
            },
          },
        },
      });

      const responseText = response.text || "[]";
      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate copy ideas" });
    }
  });

  // Serve static files and handle SPA fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
