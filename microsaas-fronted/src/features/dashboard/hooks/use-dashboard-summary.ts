import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../../../services/dashboard.service";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status;

      if (status === 401 || status === 403 || status === 404) {
        return false;
      }

      return failureCount < 1;
    },
    retryDelay: 1500,
  });
}