import axios from "axios";

import { api } from "./api";

import type {
  GenerateFullPostRequest,
  GenerateFullPostResponse,
  RegeneratePostRequest,
} from "../types/ai.types";

import type { PostItem } from "../types/post.types";

const AI_TIMEOUT = 1000 * 90;

export const aiService = {
  async generateFullPost(
    payload: GenerateFullPostRequest
  ): Promise<GenerateFullPostResponse> {
    const controller = new AbortController();

    try {
      const response = await api.post<GenerateFullPostResponse>(
        "/ai/generate-full-post",
        payload,
        {
          timeout: AI_TIMEOUT,
          signal: controller.signal,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new Error("La generación fue cancelada.");
      }

      throw error;
    }
  },

  async regenerateText(
    postId: number,
    payload: RegeneratePostRequest
  ): Promise<PostItem> {
    const controller = new AbortController();

    try {
      const response = await api.post<PostItem>(
        `/ai/posts/${postId}/regenerate-text`,
        payload,
        {
          timeout: AI_TIMEOUT,
          signal: controller.signal,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new Error("La regeneración fue cancelada.");
      }

      throw error;
    }
  },

  async regenerateImage(
    postId: number,
    payload: RegeneratePostRequest
  ): Promise<PostItem> {
    const controller = new AbortController();

    try {
      const response = await api.post<PostItem>(
        `/ai/posts/${postId}/regenerate-image`,
        payload,
        {
          timeout: AI_TIMEOUT,
          signal: controller.signal,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new Error("La regeneración fue cancelada.");
      }

      throw error;
    }
  },
};