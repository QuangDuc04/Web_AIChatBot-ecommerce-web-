export interface News {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  /** Full HTML/markdown content of the article */
  content: string | null;
  /** Cloudinary URL for the cover image */
  thumbnail: string | null;
  author: string | null;
  isActive: boolean;
  displayOrder: number;
  publishedAt: Date | string | null;
  tags: string[] | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
