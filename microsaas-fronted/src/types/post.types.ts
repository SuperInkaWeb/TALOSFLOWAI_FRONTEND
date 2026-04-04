export type PostStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "PROCESSING"
  | "PUBLISHED"
  | "FAILED"
  | "CANCELED";

export type PostTargetStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELED";

export interface PostTargetItem {
  socialPageId: number;
  pageName: string;
  status: PostTargetStatus;
  externalPostId?: string | null;
  errorMessage?: string | null;
}

export interface PostItem {
  id: number;
  content: string;
  mediaUrl?: string | null;
  status: PostStatus;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  errorMessage?: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  targets: PostTargetItem[];
}

export interface CreatePostRequest {
  content: string;
  mediaUrl?: string | null;
  scheduledAt?: string | null;
  targetPageIds: number[];
}

export interface UpdatePostRequest {
  content?: string | null;
  mediaUrl?: string | null;
  scheduledAt?: string | null;
  targetPageIds?: number[];
}

export interface ReschedulePostRequest {
  scheduledAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}