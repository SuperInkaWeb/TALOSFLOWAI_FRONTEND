import type { PostItem } from "./post.types";

export interface DashboardSummary {
  totalPosts: number;
  publishedPosts: number;
  failedPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  processingPosts: number;
  canceledPosts: number;
  totalPages: number;
  aiUsed: number;
  aiLimit: number;
  successRate: number;
  recentPosts: PostItem[];
}

export interface SocialAccountItem {
  id: number;
  accountName: string;
  externalAccountId: string;
  status: string;
}

export interface SocialPageItem {
  id: number;
  pageName: string;
  pageId: string;
  status: string;
}