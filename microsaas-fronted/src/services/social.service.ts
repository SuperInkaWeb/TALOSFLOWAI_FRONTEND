import { api } from "./api";
import type {
  ConnectMetaResponse,
  SocialAccount,
  SocialPage,
  SyncPagesResponse,
} from "../types/social.types";

export const socialService = {
  async getConnectMetaUrl(): Promise<ConnectMetaResponse> {
    const response = await api.get<ConnectMetaResponse>("/social-accounts/meta/connect");
    return response.data;
  },

  async getAccounts(): Promise<SocialAccount[]> {
    const response = await api.get<SocialAccount[]>("/social-accounts");
    return response.data;
  },

  async disconnectAccount(accountId: number): Promise<SocialAccount> {
    const response = await api.patch<SocialAccount>(`/social-accounts/${accountId}/disconnect`);
    return response.data;
  },

  async activateAccount(accountId: number): Promise<SocialAccount> {
    const response = await api.patch<SocialAccount>(`/social-accounts/${accountId}/activate`);
    return response.data;
  },

  async syncPages(accountId: number): Promise<SyncPagesResponse> {
    const response = await api.post<SyncPagesResponse>(
      `/social-accounts/${accountId}/meta/pages/sync`
    );
    return response.data;
  },

  async getAllPages(): Promise<SocialPage[]> {
    const response = await api.get<SocialPage[]>("/social-accounts/pages");
    return response.data;
  },

  async getPagesByAccount(accountId: number): Promise<SocialPage[]> {
    const response = await api.get<SocialPage[]>(`/social-accounts/${accountId}/pages`);
    return response.data;
  },
};