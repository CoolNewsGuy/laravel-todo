import { Config } from "ziggy-js";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  has_added_color: boolean;
}

export interface Color {
  id: number;
  color: string;
  is_favorite: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  };
  ziggy: Config & { location: string };
};
