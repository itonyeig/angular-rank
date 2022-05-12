export interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  followers_url: string;
  html_url: string;
  user_api_url: string;
  repos_url: string;
  contributions: number;
  email?: string;
}

export interface ContributorsResponse {
  totalPages: number | null;
  contributors: Contributor[];
}
