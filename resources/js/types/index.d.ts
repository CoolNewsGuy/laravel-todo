import { Config } from "ziggy-js";

export interface User {
  id: number;
  name: string;
  email: string;
  image: string | null;
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
  comments: Comment[];
}

export interface Like {
  user_id: number;
  comment_id: number;
}

export interface Comment {
  id: number;
  content: string;
  likes: Like[];
  color_id: number;
  user: User;
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
