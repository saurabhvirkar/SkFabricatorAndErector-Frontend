export interface Service {
  id: number;
  name: string;
  summary?: string;
  description?: string;
  imageUrl?: string;
  slug?: string;
  subtitle?: string;
  teaser?: string;
  iconName?: string;
  bulletTitle?: string;
  bulletsJson?: string;
  photoPlaceholder?: string;
  featured?: boolean;
  sortOrder?: number;
}
