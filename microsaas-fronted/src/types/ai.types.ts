export type AiTone =
  | "PROFESIONAL"
  | "EMOCIONAL"
  | "DIVERTIDO"
  | "PERSUASIVO"
  | "CERCANO";

export type AiPlatform = "FACEBOOK" | "INSTAGRAM";

export type CreativeOptions = {
  useBranding: boolean;
  showLogo: boolean;
  showCTA: boolean;
  showSocialLinks: boolean;
  template?: string | null;
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
  tone: string;
  platform: string;
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
  tone: string;
  platform: string;
};