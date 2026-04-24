import { getActiveNews } from "@/lib/api/services/newsService";
import NewsSection from "./index";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import type { News } from "@/types/news";

export default async function NewsWrapper() {
  const news = await getActiveNews().catch((): News[] => []);

  return (
    <AnimateOnScroll animation="fade-up">
      <NewsSection news={news} />
    </AnimateOnScroll>
  );
}
