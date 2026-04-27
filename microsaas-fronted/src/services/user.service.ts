import { api } from "./api";
import type {
  CreateUserRequest,
  UpdateUserPasswordRequest,
  UpdateUserRequest,
  UserItem,
} from "../types/user.types";

export const userService = {
  async getUsers(): Promise<UserItem[]> {
    const response = await api.get<UserItem[]>("/users");
    return response.data;
  },

  async getUserById(userId: number): Promise<UserItem> {
    const response = await api.get<UserItem>(`/users/${userId}`);
    return response.data;
  },

  async createUser(payload: CreateUserRequest): Promise<UserItem> {
    const response = await api.post<UserItem>("/users", payload);
    return response.data;
  },

  async updateUser(userId: number, payload: UpdateUserRequest): Promise<UserItem> {
    const response = await api.put<UserItem>(`/users/${userId}`, payload);
    return response.data;
  },

  async updateUserPassword(
    userId: number,
    payload: UpdateUserPasswordRequest
  ): Promise<UserItem> {
    const response = await api.patch<UserItem>(`/users/${userId}/password`, payload);
    return response.data;
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  },
};