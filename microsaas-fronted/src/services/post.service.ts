import { api } from "./api";
import type {
  CreatePostRequest,
  PagedResponse,
  PostItem,
  ReschedulePostRequest,
  UpdatePostRequest,
  PostStatus,
} from "../types/post.types";

type GetPostsParams = {
  page?: number;
  size?: number;
  status?: PostStatus;
};

export const postService = {
  async getPosts(params: GetPostsParams = {}): Promise<PagedResponse<PostItem>> {
    const { page = 0, size = 10, status } = params;

    const response = await api.get<PagedResponse<PostItem>>("/posts", {
      params: {
        page,
        size,
        ...(status ? { status } : {}),
      },
    });

    return response.data;
  },

  async getPostById(postId: number): Promise<PostItem> {
    const response = await api.get<PostItem>(`/posts/${postId}`);
    return response.data;
  },

  async createPost(payload: CreatePostRequest): Promise<PostItem> {
    const response = await api.post<PostItem>("/posts", payload);
    return response.data;
  },

  async updatePost(postId: number, payload: UpdatePostRequest): Promise<PostItem> {
    const response = await api.put<PostItem>(`/posts/${postId}`, payload);
    return response.data;
  },

  async cancelPost(postId: number): Promise<PostItem> {
    const response = await api.patch<PostItem>(`/posts/${postId}/cancel`);
    return response.data;
  },

  async restorePost(postId: number): Promise<PostItem> {
    const response = await api.patch<PostItem>(`/posts/${postId}/restore`);
    return response.data;
  },

  async reschedulePost(
    postId: number,
    payload: ReschedulePostRequest
  ): Promise<PostItem> {
    const response = await api.patch<PostItem>(`/posts/${postId}/reschedule`, payload);
    return response.data;
  },

  async publishPost(postId: number): Promise<PostItem> {
    const response = await api.patch<PostItem>(`/posts/${postId}/publish`);
    return response.data;
  },

  async retryPost(postId: number): Promise<PostItem> {
    const response = await api.patch<PostItem>(`/posts/${postId}/retry`);
    return response.data;
  },
};