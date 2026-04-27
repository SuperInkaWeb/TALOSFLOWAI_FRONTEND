import { api } from "./api";
import type {
  GenerateFullPostRequest,
  GenerateFullPostResponse,
  RegeneratePostRequest,
} from "../types/ai.types";
import type { PostItem } from "../types/post.types";

export const aiService = {
  async generateFullPost(
    payload: GenerateFullPostRequest
  ): Promise<GenerateFullPostResponse> {
    const response = await api.post<GenerateFullPostResponse>(
      "/ai/generate-full-post",
      payload
    );

    return response.data;
  },

  async regenerateText(
    postId: number,
    payload: RegeneratePostRequest
  ): Promise<PostItem> {
    const response = await api.post<PostItem>(
      `/ai/posts/${postId}/regenerate-text`,
      payload
    );

    return response.data;
  },

  async regenerateImage(
    postId: number,
    payload: RegeneratePostRequest
  ): Promise<PostItem> {
    const response = await api.post<PostItem>(
      `/ai/posts/${postId}/regenerate-image`,
      payload
    );

    return response.data;
  },
};