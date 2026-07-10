export interface LandingData {
  heroTag: string;
  heroTitle: string;
  heroSub: string;
  heroCtaText: string;
  heroImage?: string; // 이미지 1 (히어로 상단)
  painTitle: string;
  painDesc: string;
  pains: { icon: string; text: string }[];
  solutionTitle: string;
  solutionDesc: string;
  solutionBoxText: string;
  solutionImage?: string; // 이미지 2 (중간 배너)
  benefitTitle: string;
  benefitDesc: string;
  benefits: { title: string; desc: string }[];
  reviewsTitle: string;
  reviewsDesc: string;
  reviews: { quote: string; text: string; author: string }[];
  ctaFormTitle: string;
  ctaFormDesc: string;
  ctaFormNote: string;
}

export interface AiSuggestion {
  id: number;
  concept: string;
  headline: string;
  sub: string;
  whyItWorks: string;
}

export interface Persona {
  name: string;
  ageGroup: string;
  char: string;
  pains: string[];
  desires: string[];
  receptivity: string; // U+ 혜택을 볼 때 가질 의구심이나 반응
}
