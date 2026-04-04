import { api } from "./api";
import type {
  DashboardSummary,
  SocialAccountItem,
  SocialPageItem,
} from "../types/dashboard.types";
import type { PagedResponse, PostItem } from "../types/post.types";

export async function getPosts(): Promise<PostItem[]> {
  const response = await api.get<PagedResponse<PostItem>>("/posts");
  return response.data.items;
}

export async function getSocialAccounts(): Promise<SocialAccountItem[]> {
  const response = await api.get<SocialAccountItem[]>("/social-accounts");
  return response.data;
}

export async function getPagesByAccount(
  accountId: number
): Promise<SocialPageItem[]> {
  const response = await api.get<SocialPageItem[]>(
    `/social-accounts/${accountId}/pages`
  );
  return response.data;
}

export async function getAllSocialPages(): Promise<SocialPageItem[]> {
  const accounts = await getSocialAccounts();

  if (!accounts.length) return [];

  const pagesArrays = await Promise.all(
    accounts.map((acc) => getPagesByAccount(acc.id))
  );

  return pagesArrays.flat();
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>("/dashboard/summary");
  return response.data;
}