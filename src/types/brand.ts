export interface Brand {
  id: string;
  name: string;
  slug: string;
  /** Cloudinary URL for the brand logo */
  logo: string | null;
  description: string | null;
  website: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
