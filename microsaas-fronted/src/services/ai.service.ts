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
    const { data } = await api.post<GenerateFullPostResponse>(
      "/ai/generate-full-post",
      payload
    );
    return data;
  },

  async regenerateText(
    postId: number,
    payload: RegeneratePostRequest
  ): Promise<PostItem> {
    const { data } = await api.post<PostItem>(
      `/ai/posts/${postId}/regenerate-text`,
      payload
    );
    return data;
  },

  async regenerateImage(
    postId: number,
    payload: RegeneratePostRequest
  ): Promise<PostItem> {
    const { data } = await api.post<PostItem>(
      `/ai/posts/${postId}/regenerate-image`,
      payload
    );
    return data;
  },
};