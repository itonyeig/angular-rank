export interface Contributor {
  avatar_url: string;
  bio: string;
  contributions: number;
  followers: number;
  fullName: string;
  gists: number;
  id: number;
  name: string;
  public_repos: number;
  repoName: string;
  repoNames: string[];
  userUrl: string;
}

export interface ContributorsResponse {
  totalPages: number | null;
  contributors: Contributor[];
}

export interface CacheStrorage {
  value: Contributor[];
  expiry: number;
}
