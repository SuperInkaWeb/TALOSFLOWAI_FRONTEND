import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { platformOrganizationService } from "../../../services/platform-organization.service";

export function useUpdatePlatformOrganizationStatusAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
    }) => {
      return platformOrganizationService.updateStatus(id, { status });
    },
    onSuccess: async (_, variables) => {
      message.success("Estado de organización actualizado");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["platform-organizations"] }),
        queryClient.invalidateQueries({
          queryKey: ["platform-organization-detail", variables.id],
        }),
      ]);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "No se pudo actualizar el estado";
      message.error(msg);
    },
  });
}