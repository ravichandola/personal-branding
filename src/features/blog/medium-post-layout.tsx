import { MdxArticle } from "@/features/blog/mdx-content";
import { mediumMdxBodyWithoutDuplicateExcerpt } from "@/lib/external-content";

type MediumPostLayoutProps = {
  title: string;
  excerpt: string;
  publishedAt: Date | null;
  canonicalUrl: string;
  content: string;
};

export function MediumPostLayout({
  title,
  excerpt,
  publishedAt,
  canonicalUrl,
  content,
}: MediumPostLayoutProps) {
  return (
    <article className="mx-auto max-w-[728px] space-y-10">
      <header className="space-y-6 border-b border-white/10 pb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.12em] text-[#5bd37d]">
          <span className="rounded-full border border-[#1a8917]/45 bg-[#1a8917]/12 px-3 py-1 text-[#8fd99a]">
            Originally on Medium
          </span>
          {publishedAt ? (
            <time
              dateTime={publishedAt.toISOString()}
              className="text-slate-500 normal-case tracking-normal"
            >
              {publishedAt.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          ) : null}
        </div>
        <h1 className="font-serif text-[2.75rem] font-normal leading-[1.12] tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        <p className="font-serif text-xl font-light leading-relaxed text-slate-300">
          {excerpt}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#1a8917] px-7 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-20px_rgba(26,137,23,0.9)] transition hover:bg-[#157912]"
          >
            Read on Medium
          </a>
          <a
            href={canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-[#1a8917]/50 hover:text-white"
          >
            Open in new tab
          </a>
        </div>
      </header>
      <div className="medium-mdx prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-a:text-[#5bd37d] prose-blockquote:border-l-[#1a8917]">
        <MdxArticle
          source={mediumMdxBodyWithoutDuplicateExcerpt(content, excerpt)}
        />
      </div>
    </article>
  );
}
