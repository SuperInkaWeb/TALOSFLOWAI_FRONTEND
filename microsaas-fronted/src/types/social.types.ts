export type SocialAccountStatus = "ACTIVE" | "DISCONNECTED";
export type SocialPageStatus = "ACTIVE" | "DISCONNECTED";

export type SocialAccount = {
  id: number;
  providerKey: string;
  providerName: string;
  accountName: string;
  externalAccountId?: string | null;
  status: SocialAccountStatus;
  connectedAt: string;
  disconnectedAt?: string | null;
  expiresAt?: string | null;
};

export type SocialPage = {
  id: number;
  socialAccountId: number;
  pageId: string;
  pageName: string;
  status: SocialPageStatus;
  connectedAt: string;
  disconnectedAt?: string | null;
};

export type ConnectMetaResponse = {
  provider: string;
  authorizationUrl: string;
};

export type SyncPagesResponse = {
  message: string;
  socialAccountId: number;
  pagesCount: number;
  pages: SocialPage[];
};