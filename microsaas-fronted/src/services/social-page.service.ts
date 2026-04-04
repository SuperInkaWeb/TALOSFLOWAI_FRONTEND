import { api } from "./api";

export async function getSocialPages() {
  const response = await api.get("/social-accounts/1/meta/pages");

  const data = response.data;

  return data.pages.map((p: any) => ({
    id: Number(p.id),
    name: p.name,
  }));
}
