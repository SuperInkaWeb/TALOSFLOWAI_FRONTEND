import {api} from "./api";
import type {
  ReferralListItemResponse,
  ReferralSummaryResponse,
} from "../types/referral.types";

export const referralService = {
  async getSummary(): Promise<ReferralSummaryResponse> {
    const { data } = await api.get<ReferralSummaryResponse>("/referrals/summary");
    return data;
  },

  async getList(): Promise<ReferralListItemResponse[]> {
    const { data } = await api.get<ReferralListItemResponse[]>("/referrals/list");
    return data;
  },
};