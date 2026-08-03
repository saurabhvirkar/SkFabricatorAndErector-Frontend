export type ImageCategory = 'All' | 'Piping' | 'Fabrication' | 'Erection' | 'Maintenance' | 'Storage Tanks';

export interface GalleryImage {
  id: number;
  url: string;
  isMain?: boolean;
  publicId?: string;
  category?: ImageCategory | string;
  isAboutSlider?: boolean;
}
