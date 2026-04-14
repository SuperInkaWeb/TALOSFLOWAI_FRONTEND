export type BrandContactPlatform =
  | "FACEBOOK"
  | "INSTAGRAM"
  | "WHATSAPP"
  | "LINKEDIN"
  | "TIKTOK"
  | "X"
  | "YOUTUBE"
  | "WEBSITE"
  | "PHONE"
  | "EMAIL";

export type BrandProfileResponse = {
  id: number;
  brandName: string;
  legalName?: string | null;
  businessDescription?: string | null;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  logoLightUrl?: string | null;
  iconLogoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  defaultCtaText?: string | null;
  defaultCtaEnabled: boolean;
  showLogoByDefault: boolean;
  showCtaByDefault: boolean;
  showContactByDefault: boolean;
  showSocialsByDefault: boolean;
  defaultTemplate?: string | null;
  isActive: boolean;
  isCompleted: boolean;
};

export type UpsertBrandProfileRequest = {
  brandName: string;
  legalName?: string | null;
  businessDescription?: string | null;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  logoLightUrl?: string | null;
  iconLogoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  defaultCtaText?: string | null;
  defaultCtaEnabled: boolean;
  showLogoByDefault: boolean;
  showCtaByDefault: boolean;
  showContactByDefault: boolean;
  showSocialsByDefault: boolean;
  defaultTemplate?: string | null;
  isActive: boolean;
};

export type BrandSocialLinkResponse = {
  id: number;
  brandProfileId: number;
  platform: BrandContactPlatform;
  label?: string | null;
  value: string;
  url?: string | null;
  iconKey?: string | null;
  displayOrder: number;
  isActive: boolean;
  isPrimary: boolean;
};

export type CreateBrandSocialLinkRequest = {
  platform: BrandContactPlatform;
  label?: string | null;
  value: string;
  url?: string | null;
  iconKey?: string | null;
  isActive?: boolean;
  isPrimary?: boolean;
};

export type UpdateBrandSocialLinkRequest = CreateBrandSocialLinkRequest;