import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { platformOrganizationService } from "../../../services/platform-organization.service";

export function useUpdatePlatformOrganizationStatus(id?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: "ACTIVE" | "SUSPENDED" | "INACTIVE") => {
      if (!id) {
        throw new Error("Organization id is required");
      }

      return platformOrganizationService.updateStatus(id, { status });
    },
    onSuccess: async () => {
      message.success("Estado de organización actualizado");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["platform-organizations"] }),
        queryClient.invalidateQueries({ queryKey: ["platform-organization-detail", id] }),
      ]);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "No se pudo actualizar el estado";
      message.error(msg);
    },
  });
}