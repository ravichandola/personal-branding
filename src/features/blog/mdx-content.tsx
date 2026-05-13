import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";

import { MDXRemote } from "next-mdx-remote/rsc";

export type MdxArticleProps = {
  source: string;
  /**
   * `md` = CommonMark-style input only (no `{expression}` parsing). Use for
   * imported markdown where braces appear in prose or code and would break MDX.
   */
  contentFormat?: "mdx" | "md";
};

export async function MdxArticle({
  source,
  contentFormat = "mdx",
}: MdxArticleProps) {
  return (
    <MDXRemote
      components={{
        hr: () => <hr className="my-8 border-white/10" />,
      }}
      options={{
        mdxOptions: {
          ...(contentFormat === "md" ? { format: "md" as const } : {}),
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, { theme: "github-dark", keepBackground: false }],
          ],
        },
      }}
      source={source}
    />
  );
}
