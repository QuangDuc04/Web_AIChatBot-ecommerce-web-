import { getActiveNews, getNewsBySlug } from "@/lib/api/services/newsService";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import RightSide from "../[component]/RightSide";
import Breadcrumb from "@/components/Breadcrumb";
import TableOfContents from "./TableOfContents";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import ShareButton from "@/components/ShareButton";
// Server component — no onClick handlers allowed

interface TocItem { id: string; text: string; level: number }

function extractTocAndInjectIds(html: string): { toc: TocItem[]; html: string } {
  const toc: TocItem[] = [];
  let idx = 0;
  const injected = html.replace(/<(h[1-4])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text) return match;
    const level = parseInt(tag[1]);
    const id = `heading-${idx++}`;
    toc.push({ id, text, level });
    if (attrs.includes("id=")) return match;
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });
  return { toc, html: injected };
}

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const news = await getActiveNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug).catch(() => null);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary ?? undefined,
    openGraph: {
      title: article.title,
      description: article.summary ?? undefined,
      images: article.thumbnail ? [article.thumbnail] : [],
    },
  };
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug).catch(() => null);
  if (!article) return notFound();

  const date = formatDate(article.publishedAt || article.createdAt);
  const { toc, html: contentHtml } = article.content
    ? extractTocAndInjectIds(article.content)
    : { toc: [], html: "" };

  return (
    <main className="container py-6">
      <Breadcrumb
        crumbs={[
          { href: "/tin-tuc", label: "Tin tức", isLast: false },
          { href: `/tin-tuc/${article.slug}`, label: article.title, isLast: true },
        ]}
      />

      <div className="mt-6 flex items-start gap-8 lg:gap-10">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <article>
            {/* Back link */}
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-1.5 text-[14px] font-[600] text-[#1a7a74] hover:underline mb-5"
            >
              <ArrowLeft size={14} /> Quay lại tin tức
            </Link>

            {/* Title */}
            <h1 className="font-[800] text-[24px] sm:text-[30px] lg:text-[34px] text-gray-900 leading-tight mb-5">
              {article.title}
            </h1>

            {/* Meta info bar */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-8 h-8 rounded-full bg-[#edf9f8] flex items-center justify-center">
                  <Calendar size={14} className="text-[#1a7a74]" />
                </div>
                <span className="text-[14px] font-[500]">{date}</span>
              </div>

              {article.author && (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-8 h-8 rounded-full bg-[#edf9f8] flex items-center justify-center">
                    <User size={14} className="text-[#1a7a74]" />
                  </div>
                  <span className="text-[14px] font-[500]">{article.author}</span>
                </div>
              )}

              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={14} className="text-gray-400" />
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[13px] font-[500] text-[#1a7a74] bg-[#edf9f8] px-2.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {article.summary && (
              <p className="text-[16px] sm:text-[17px] text-gray-600 leading-relaxed font-[500] italic mb-6 pl-4 border-l-[3px] border-[#1a7a74]">
                {article.summary}
              </p>
            )}

            {/* Cover image */}
            {article.thumbnail && (
              <div
                className="relative rounded-2xl overflow-hidden mb-8"
                style={{ boxShadow: '0 4px 20px rgba(26,122,116,0.1)' }}
              >
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  width={900}
                  height={500}
                  className="w-full object-cover max-h-[450px]"
                  priority
                />
              </div>
            )}

            {/* Table of Contents */}
            {toc.length > 0 && <TableOfContents items={toc} />}

            {/* Article content */}
            {contentHtml && (
              <div
                className="news-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            )}

            {/* Bottom share + back */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-1.5 text-[14px] font-[600] text-[#1a7a74] hover:underline"
              >
                <ArrowLeft size={15} /> Xem thêm bài viết
              </Link>
              <ShareButton title={article.title} />
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="w-[280px] @5xl:block hidden flex-shrink-0 sticky top-[80px]">
          <RightSide />
        </div>
      </div>
    </main>
  );
}
