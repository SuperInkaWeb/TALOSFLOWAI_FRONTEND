export type UserRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export type UserItem = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type UpdateUserRequest = {
  name: string;
  email: string;
  role: UserRole;
};

export type UpdateUserPasswordRequest = {
  password: string;
};