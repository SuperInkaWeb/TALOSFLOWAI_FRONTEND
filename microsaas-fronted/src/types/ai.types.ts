export type AiTone =
  | "PROFESIONAL"
  | "EMOCIONAL"
  | "DIVERTIDO"
  | "PERSUASIVO"
  | "CERCANO";

export type AiPlatform = "FACEBOOK" | "INSTAGRAM";

export type AiTemplateValue =
  | "PREMIUM_AUTO"
  | "SOCIAL_BRAND"
  | "BOLD"
  | "SPLIT"
  | "MINIMAL";

export type ImageGenerationMode =
  | "EDITABLE_BASE"
  | "FINAL_AD_CREATIVE";

export type CreativeOptions = {
  useBranding: boolean;
  showLogo: boolean;
  showCTA: boolean;
  showSocialLinks: boolean;
  template?: AiTemplateValue | null;
  imageGenerationMode?: ImageGenerationMode;
};

export type CopyBlocks = {
  headline: string;
  subheadline?: string | null;
  caption: string;
  cta?: string | null;
  hashtags: string[];
  hook?: string | null;
  valueProposition?: string | null;
  toneDetected?: string | null;
  objective?: string | null;
};

export type QualityScore = Record<
  string,
  string | number | null | undefined
>;

export type GenerateFullPostRequest = {
  idea: string;
  tone: AiTone | string;
  platform: AiPlatform | string;
  targetPageIds: number[];
  creativeOptions: CreativeOptions;
  scheduledAt?: string | null;
};

export type GenerateFullPostResponse = {
  jobId?: number | null;
  postId: number;
  text: string;
  imageUrl?: string | null;
  status: string;
  scheduledAt?: string | null;
  copyBlocks?: CopyBlocks | null;
  qualityScore?: QualityScore | null;
  selectedLayout?: string | null;
  generatedVariants?: number | null;
};

export type RegeneratePostRequest = {
  idea: string;
  tone: AiTone | string;
  platform: AiPlatform | string;
};

export const AI_TEMPLATE_OPTIONS: Array<{
  label: string;
  value: AiTemplateValue;
}> = [
  { label: "Automático premium", value: "PREMIUM_AUTO" },
  { label: "Marca social", value: "SOCIAL_BRAND" },
  { label: "Fuerte", value: "BOLD" },
  { label: "Dividido", value: "SPLIT" },
  { label: "Mínimo", value: "MINIMAL" },
];

export const IMAGE_GENERATION_MODE_OPTIONS: Array<{
  label: string;
  value: ImageGenerationMode;
}> = [
  { label: "Base editable", value: "EDITABLE_BASE" },
  { label: "Anuncio final IA", value: "FINAL_AD_CREATIVE" },
];