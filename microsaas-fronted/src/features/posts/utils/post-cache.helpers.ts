import type { QueryClient } from "@tanstack/react-query";
import type { PagedResponse, PostItem } from "../../../types/post.types";

export async function syncPostCaches(
  queryClient: QueryClient,
  updatedPost: PostItem
) {
  queryClient.setQueryData(["post", updatedPost.id], updatedPost);

  queryClient.setQueriesData(
    { queryKey: ["posts"] },
    (oldData: PagedResponse<PostItem> | undefined) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        items: oldData.items.map((item) =>
          item.id === updatedPost.id ? updatedPost : item
        ),
      };
    }
  );

  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["posts"] }),
    queryClient.invalidateQueries({ queryKey: ["post", updatedPost.id] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
  ]);
}